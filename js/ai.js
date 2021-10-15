//var List = require("collections/list");

class Ai {

    constructor(wholeWorldKnowledge) {
        
        this.wholeWorldKnowledge=wholeWorldKnowledge;
        this.worldSize=this.wholeWorldKnowledge.roomsPerRow;
        this.agentRow=0;
        this.agentCol=0;
        this.pathKnowledge=[];
        this.pathKnowledgeInitialization();
        //console.log(this.pathKnowledge[1][1]);
        this.moves=[0,0,0,0];
        //this.knowledgeBase=new KnowledgeBase();
        this.stenchKnowledge=[];
        this.breezeKnowledge=[];
        //this.pathKnowledge=[];
        this.numberOfUnvisitedSafeBoxBehind=0;
        this.knowledgeBaseInitialization();
    }

    pathKnowledgeInitialization() {

        for (var i = 0; i < this.worldSize; i++) {
            this.pathKnowledge.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
               this.pathKnowledge[i].push(0);
            }
            this.pathKnowledge[0][0]=1;
        }
    }

    knowledgeBaseInitialization() {

        for (var i = 0; i < this.worldSize; i++) {
            this.breezeKnowledge.push(new Array());
            this.stenchKnowledge.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
                this.breezeKnowledge[i].push(0);
                this.stenchKnowledge[i].push(0);
            }
            this.breezeKnowledge[0][0]=-1;
            this.stenchKnowledge[0][0]=-1;
        }
    }

    ifShootWumpus() {

    }

    getNextMove() {

        this.calculateAvailableMoves();
        this.calculateSafeMoves();
        let nextMove = this.finalMove();
        //console.log(nextMove);
        if(nextMove==0)
        {
            this.updateKnowledgeBase(this.agentRow-1,this.agentCol);
            this.agentRow=this.agentRow-1;
        }
        if(nextMove==1)
        {
            this.updateKnowledgeBase(this.agentRow,this.agentCol+1);
            this.agentCol=this.agentCol+1;
        }
        if(nextMove==2)
        {
            this.updateKnowledgeBase(this.agentRow+1,this.agentCol);
            this.agentRow=this.agentRow+1;
        }
        if(nextMove==3)
        {
            this.updateKnowledgeBase(this.agentRow,this.agentCol-1);
            this.agentCol=this.agentCol-1;
        }
        this.moves=[0,0,0,0];
        return nextMove;
    }

    updateKnowledgeBase(row, col) {
        //console.log(row);
        //console.log(col);
        this.pathKnowledge[row][col]++;//=this.pathKnowledge[row][col]+1;
        if (this.wholeWorldKnowledge.getRoom(col,row).containsBreeze())
        {
            this.breezeKnowledge[row][col]=1;
        }
        else
        {
            this.breezeKnowledge[row][col]=-1;
        }

        if (this.wholeWorldKnowledge.getRoom(col,row).containsStench())
        {
            this.stenchKnowledge[row][col]=1;
        }
        else
        {
            this.stenchKnowledge[row][col]=-1;
        }

        //console.log("Update breeze for " + row + "and" + col + " : " + this.breezeKnowledge[row][col]);
    }

    finalMove() {
        let bestMove = 0;
        let bestMoveArray = [];
        let bestMoveCost = 9999999;
        for (var i = 0; i < this.moves.length; i++) {
            //console.log("cost: " + this.moves[i]);
            if (this.moves[i]>-1)
            {
                if (this.moves[i]==0)
                {
                    this.numberOfUnvisitedSafeBoxBehind++;
                }
                if(this.moves[i]<bestMoveCost)
                {
                    bestMove = i;
                    bestMoveCost=this.moves[i];
                }
            }
        }

        if (bestMoveCost==0)
        {
            this.numberOfUnvisitedSafeBoxBehind--;
        }
        else
        {
            // if (this.numberOfUnvisitedSafeBoxBehind==0) {
            //     this.handleDeadlockSituation();
            // }
        }

        bestMoveArray.push(bestMove); //kahini

        return bestMoveArray;
    }

    handleDeadlockSituation() {

        let unSafeBoxCostArray = [];
        for (var i = 0; i < this.worldSize; i++) {
            for (var j = 0; j < this.worldSize; j++) {
                if (this.breezeKnowledge[i][j]==0)
                {
                    let row = i;
                    let col = j;

                    let numberOfThreats = 0;
                    let numberOfAvailableBoxes = 0;

                    if (this.isBoxAvailable(row,col+1))
                    {
                        numberOfAvailableBoxes++;
                        if(this.breezeKnowledge[row][col+1]==1)
                        {
                            numberOfThreats++;
                        }
                        if(this.stenchKnowledge[row][col+1]==1)
                        {
                            numberOfThreats++;
                        }
                    }
                    if (this.isBoxAvailable(row+1,col))
                    {
                        numberOfAvailableBoxes++;
                        if(this.breezeKnowledge[row+1][col]==1)
                        {
                            numberOfThreats++;
                        }
                        if(this.stenchKnowledge[row+1][col]==1)
                        {
                            numberOfThreats++;
                        }
                    }
                    if (this.isBoxAvailable(row-1,col))
                    {
                        numberOfAvailableBoxes++;
                        if(this.breezeKnowledge[row-1][col]==1)
                        {
                            numberOfThreats++;
                        }
                        if(this.stenchKnowledge[row-1][col]==1)
                        {
                            numberOfThreats++;
                        }
                    }
                    if (this.isBoxAvailable(row,col-1))
                    {
                        numberOfAvailableBoxes++;
                        if(this.breezeKnowledge[row][col-1]==1)
                        {
                            numberOfThreats++;
                        }
                        if(this.stenchKnowledge[row][col-1]==1)
                        {
                            numberOfThreats++;
                        }
                    }

                    let unSafeBox = new Unsafeboxcost (row, col, parseFloat(numberOfThreats/numberOfAvailableBoxes));

                    unSafeBoxCostArray.push(unSafeBox);
                }
            }
        }

        this.calculateBestBoxForDeadlock(unSafeBoxCostArray);
    }

    calculateBestBoxForDeadlock(unSafeBoxCostArray)
    {
        let maxCost = -10;
        let finalBox = unSafeBoxCostArray[0];

        for (var i = 0; i < unSafeBoxCostArray.length; i++) {
            
            if (unSafeBoxCostArray[i].cost>maxCost)
            {
                maxCost = unSafeBoxCostArray[i].cost;
                finalBox = unSafeBoxCostArray[i];
            }
        }

        let row = finalBox.row;
        let col = finalBox.col;

        if (this.isBoxAvailable(row+1,col+1)&&this.pathKnowledge[row+1][col+1]==0)
        {
            row = row+1;
            col = col+1;
        }
        else if (this.isBoxAvailable(row+1,col-1)&&this.pathKnowledge[row+1][col-1]==0)
        {
            row = row+1;
            col = col-1;
        }
        else if (this.isBoxAvailable(row-1,col-1)&&this.pathKnowledge[row-1][col-1]==0)
        {
            row = row-1;
            col = col-1;
        }
        else if (this.isBoxAvailable(row-1,col+1)&&this.pathKnowledge[row-1][col+1]==0)
        {
            row = row-1;
            col = col+1;
        }

        this.calculateQueueOfMoves(row, col);
    }

    calculateQueueOfMoves(row, col)
    {
        let pathMap = [];
        for (var i = 0; i < this.worldSize; i++) {
            this.pathMap.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
               if (this.pathKnowledge[i][j]==0)
               {
                   pathMap[i][j]=-1;
               }
               else
               {
                   pathMap[i][j]=0;
               }
            }
        }

        pathMap[row][col]=0;

        let arrayOfMoves = recursion

        /*let queue = [];
        queue.push([this.agentRow,this.agentCol]);*/

        /*while(queue.length>0)
        {
            let currentBox = queue[0];
            queue.shift();
           
            pathMap[currentBox[0]][currentBox[1]] = -1;
            
            // Destination is reached. 
            if (currentBox[0]==row&&currentBox[1]==col)
                return true;

            if (this.isBoxAvailable(currentBox[0]+1,currentBox[1])&&this.pathMap[currentBox[0]+1][currentBox[1]]==0)
            {
                queue.push([currentBox[0]+1,currentBox[1]]);
            }
            if (this.isBoxAvailable(currentBox[0],currentBox[1]+1)&&this.pathMap[currentBox[0]][currentBox[1]+1]==0)
            {
                queue.push([currentBox[0],currentBox[1]+1]);
            }
            if (this.isBoxAvailable(currentBox[0],currentBox[1]-1)&&this.pathMap[currentBox[0]][currentBox[1]-1]==0)
            {
                queue.push([currentBox[0],currentBox[1]-1]);
            }
            if (this.isBoxAvailable(currentBox[0]-1,currentBox[1])&&this.pathMap[currentBox[0]-1][currentBox[1]]==0)
            {
                queue.push([currentBox[0]-1,currentBox[1]]);
            }
        }*/

        recursion (currentBox, pathMap, row, col, arrayOfMoves, move)
        {
            pathMap[currentBox[0]][currentBox[1]] = -1;
            
            // Destination is reached. 
            if (currentBox[0]==row&&currentBox[1]==col)
            {
                return arrayOfMoves;
            }

            let a, b, c, d;

            if (this.isBoxAvailable(currentBox[0]+1,currentBox[1])&&this.pathMap[currentBox[0]+1][currentBox[1]]==0)
            {
                a = this.recursion([currentBox[o]+1,currentBox[1]], pathMap, row, col, arrayOfMoves, 2);
            }
            if (this.isBoxAvailable(currentBox[0],currentBox[1]+1)&&this.pathMap[currentBox[0]][currentBox[1]+1]==0)
            {
                b= this.recursion([currentBox[o],currentBox[1]+1], pathMap, row, col, arrayOfMoves, 1);
            }
            if (this.isBoxAvailable(currentBox[0],currentBox[1]-1)&&this.pathMap[currentBox[0]][currentBox[1]-1]==0)
            {
                c = this.recursion([currentBox[o],currentBox[1]-1], pathMap, row, col, arrayOfMoves, 3);
            }
            if (this.isBoxAvailable(currentBox[0]-1,currentBox[1])&&this.pathMap[currentBox[0]-1][currentBox[1]]==0)
            {
                d = this.recursion([currentBox[o]-1,currentBox[1]], pathMap, row, col, arrayOfMoves, 0);
            }

            if (a!=null)
            {
                return a;
            }
            else if (b!=null)
            {
                return b;
            }
            else if (c!=null)
            {
                return c;
            }
            else if (d!=null)
            {
                return d;
            }
        }

        

        


        /*let arrayOfMoves = [];
        let currentRow = this.agentRow;
        let currentCol = this.agentCol;

        while (currentRow!=row||currentCol!=col)
        {
            if(row>currentRow)
            {
                if (this.isBoxAvailable(currentRow+1,currentCol)&&this.pathKnowledge[currentRow+1][currentCol]>0)
                {
                    arrayOfMoves.push(2);
                    currentRow++;
                }
            }
            if(col>currentCol)
            {
                if (this.isBoxAvailable(currentRow,currentCol+1)&&this.pathKnowledge[currentRow][currentCol+1]>0)
                {
                    arrayOfMoves.push(1);
                    currentCol++;
                }
            }
            if(row<currentRow)
            {
                if (this.isBoxAvailable(currentRow-1,currentCol)&&this.pathKnowledge[currentRow-1][currentCol]>0)
                {
                    arrayOfMoves.push(0);
                    currentRow--;
                }
            }
            if(col<currentCol)
            {
                if (this.isBoxAvailable(currentRow,currentCol-1)&&this.pathKnowledge[currentRow][currentCol-1]>0)
                {
                    arrayOfMoves.push(3);
                    currentCol--;
                }
            }
        }*/
    }

    isMoveSafe(row,col) {

        if (this.isBoxAvailable(row,col+1))
        {
            if(this.breezeKnowledge[row][col+1]==-1&&this.stenchKnowledge[row][col+1]==-1)
            {
                return true;
            }
        }
        if (this.isBoxAvailable(row+1,col))
        {
            if(this.breezeKnowledge[row+1][col]==-1&&this.stenchKnowledge[row+1][col]==-1)
            {
                return true;
            }
        }
        if (this.isBoxAvailable(row-1,col))
        {
            if(this.breezeKnowledge[row-1][col]==-1&&this.stenchKnowledge[row-1][col]==-1)
            {
                return true;
            }
        }
        if (this.isBoxAvailable(row,col-1))
        {
            if(this.breezeKnowledge[row][col-1]==-1&&this.stenchKnowledge[row][col-1]==-1)
            {
                return true;
            }
        }

        return false;
    }

    isBoxAvailable (row, col)
    {
        if (row<0||row>this.worldSize-1||col<0||col>this.worldSize-1)
        {
            return false;
        }
        return true;
    }

    calculateSafeMoves() {
        for (var i = 0; i < this.moves.length; i++) {
            if (this.moves[i]!=-1)
            {
                if (i==0)
                {
                    if (this.isMoveSafe(this.agentRow-1,this.agentCol)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow-1][this.agentCol];
                    }
                    else
                    {
                        this.moves[i]=-1;
                    }
                }
                if (i==1)
                {
                    if (this.isMoveSafe(this.agentRow,this.agentCol+1)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow][this.agentCol + 1];
                    }
                    else
                    {
                        this.moves[i]=-1;
                    }
                }
                if (i==2)
                {
                    if (this.isMoveSafe(this.agentRow+1,this.agentCol)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow+1][this.agentCol];
                    }
                    else
                    {
                        this.moves[i]=-1;
                    }
                }
                if (i==3)
                {
                    if (this.isMoveSafe(this.agentRow,this.agentCol-1)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow][this.agentCol-1];
                    }
                    else
                    {
                        this.moves[i]=-1;
                    }
                }
            }
        }
    }

    calculateAvailableMoves() {
        if(this.agentRow==0)
        {
            this.moves[0]=-1;
        }
        if(this.agentRow==this.worldSize-1)
        {
            this.moves[2]=-1;
        }
        if(this.agentCol==0)
        {
            this.moves[3]=-1;
        }
        if(this.agentCol==this.worldSize-1)
        {
            this.moves[1]=-1;
        }
    }
}