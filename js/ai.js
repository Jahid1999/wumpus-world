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
        this.deadlockBreakingBoxRow;
        this.deadlockBreakingBoxCol;
        this.unvisitedSafeBoxMap=[];
        this.unvisitedSafeBoxMapInitialization();
    }

    unvisitedSafeBoxMapInitialization() {
        for (var i = 0; i < this.worldSize; i++) {
            this.unvisitedSafeBoxMap.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
               this.unvisitedSafeBoxMap[i].push(0);
            }
        }
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

        console.log(this.moves);
        //.log("Current block cost: " + this.pathKnowledge[this.agentRow][this.agentCol]);
        this.calculateAvailableMoves();
        this.calculateSafeMoves();
        let nextMoveArray = this.finalMove();

        if (!this.isDeadlock())
        {
            console.log("Normal Move: ");
            if(nextMoveArray[0]==0)
            {
                console.log("UP");
                this.updateKnowledgeBase(this.agentRow-1,this.agentCol);
                this.agentRow=this.agentRow-1;
            }
            if(nextMoveArray[0]==1)
            {
                console.log("RIGHT");
                this.updateKnowledgeBase(this.agentRow,this.agentCol+1);
                this.agentCol=this.agentCol+1;
            }
            if(nextMoveArray[0]==2)
            {
                console.log("DOWN");
                this.updateKnowledgeBase(this.agentRow+1,this.agentCol);//kahini
                this.agentRow=this.agentRow+1;
            }
            if(nextMoveArray[0]==3)
            {
                console.log("LEFT");
                this.updateKnowledgeBase(this.agentRow,this.agentCol-1);
                this.agentCol=this.agentCol-1;
            }
        }
        else
        {
            console.log("Deadlock Move: ");
            this.updateKnowledgeBase(this.deadlockBreakingBoxRow, this.deadlockBreakingBoxCol);
            this.agentRow=this.deadlockBreakingBoxRow;
            this.agentCol=this.deadlockBreakingBoxCol;
        }
        //console.log(nextMove);
        
        this.moves=[0,0,0,0];
        return nextMoveArray;
    }

    updateKnowledgeBase(row, col) {
        console.log(row);
        console.log(col);
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

    // updatePathKnowledgeForDeadlock(nextMoveArray) {
    //     for(let i=0; i<nextMoveArray.length; i++)
    //     {
    //         if(nextMoveArray[i]==0)
    //         {
    //             this.pathKnowledge
    //         }
    //         if(nextMoveArray[i]==1)
    //         {
    //             this.updateKnowledgeBase(this.agentRow,this.agentCol+1);
    //             this.agentCol=this.agentCol+1;
    //         }
    //         if(nextMoveArray[i]==2)
    //         {
    //             this.updateKnowledgeBase(this.agentRow+1,this.agentCol);
    //             this.agentRow=this.agentRow+1;
    //         }
    //         if(nextMoveArray[i]==3)
    //         {
    //             this.updateKnowledgeBase(this.agentRow,this.agentCol-1);
    //             this.agentCol=this.agentCol-1;
    //         }
    //     }
    // }

    isDeadlock()
    {
        let deadlockKnowledge = [];

        for (var i = 0; i < this.worldSize; i++) {
            deadlockKnowledge.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
               deadlockKnowledge[i].push(0);
            }
        }

        for (var i = 0; i < this.worldSize; i++) {
            for (var j = 0; j < this.worldSize; j++) {
                if (this.breezeKnowledge[i][j]==1||this.stenchKnowledge[i][j]==1)
                {
                    deadlockKnowledge[i][j]=-1;
                }
            }
        }

        for (var i = 0; i < this.worldSize; i++) {
            for (var j = 0; j < this.worldSize; j++) {
                if (this.pathKnowledge[i][j]==0)
                {
                    return !this.isPathAvailable(i, j, deadlockKnowledge);
                }
            }
        }
    }

    isPathAvailable(row, col, pathMap) {
        
        let queue = [];
        queue.push([this.agentRow,this.agentCol]);

        while(queue.length>0)
        {
            let currentBox = queue[0];
            queue.shift();
           
            pathMap[currentBox[0]][currentBox[1]] = -1;
            
            // Destination is reached. 
            if (currentBox[0]==row&&currentBox[1]==col)
                return true;

            if (this.isBoxAvailable(currentBox[0]+1,currentBox[1])&&pathMap[currentBox[0]+1][currentBox[1]]==0)
            {
                queue.push([currentBox[0]+1,currentBox[1]]);
            }
            if (this.isBoxAvailable(currentBox[0],currentBox[1]+1)&&pathMap[currentBox[0]][currentBox[1]+1]==0)
            {
                queue.push([currentBox[0],currentBox[1]+1]);
            }
            if (this.isBoxAvailable(currentBox[0],currentBox[1]-1)&&pathMap[currentBox[0]][currentBox[1]-1]==0)
            {
                queue.push([currentBox[0],currentBox[1]-1]);
            }
            if (this.isBoxAvailable(currentBox[0]-1,currentBox[1])&&pathMap[currentBox[0]-1][currentBox[1]]==0)
            {
                queue.push([currentBox[0]-1,currentBox[1]]);
            }
        }

        return false;
    }

    finalMove() {
        let bestMove = 0;
        let bestMoveArray = [];
        let bestMoveCost = 9999999;
        console.log(this.moves);
        for (var i = 0; i < this.moves.length; i++) {
            //console.log("cost: " + this.moves[i]);
            if (this.moves[i]>-1)
            {
                // if (this.moves[i]==0&&this.pathKnowledge[this.agentRow][this.agentCol]==1)
                // {
                //     this.numberOfUnvisitedSafeBoxBehind++;
                // }
                if(this.moves[i]<bestMoveCost)
                {
                    bestMove = i;
                    bestMoveCost=this.moves[i];
                    //console.log("Best Move Cost: " + bestMoveCost);
                }
            }
        }

        if (this.isDeadlock())
        {
            console.log("DEADLOCK DETECTED!!!!!!!")
            bestMoveArray = this.handleDeadlockSituation();
        }
        else
        {
            bestMoveArray.push(bestMove);
        }

        // if (this.numberOfUnvisitedSafeBoxBehind>0)
        // {
        //     if (bestMoveCost==0)
        //     {
        //         // if (bestMove==0)
        //         // {
        //         //     this.unvisitedSafeBoxMap[this.agentRow-1][this.agentCol]=0;
        //         // }
        //         // else if (bestMove==1)
        //         // {
        //         //     this.unvisitedSafeBoxMap[this.agentRow][this.agentCol+1]=0;
        //         // }
        //         // else if (bestMove==2)
        //         // {
        //         //     this.unvisitedSafeBoxMap[this.agentRow+1][this.agentCol]=0;
        //         // }
        //         // else if (bestMove==3)
        //         // {
        //         //     this.unvisitedSafeBoxMap[this.agentRow][this.agentCol-1]=0;
        //         // }
        //         //this.numberOfUnvisitedSafeBoxBehind--;
        //         bestMoveArray.push(bestMove);
        //     }
        //     else
        //     {
        //         bestMoveArray.push(bestMove);
        //     }
        // }
        // else
        // {
        //     bestMoveArray = this.handleDeadlockSituation();
        // }

        //console.log("Number of safe box behind: " + this.numberOfUnvisitedSafeBoxBehind);

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

        let arrayOfMoves = this.calculateBestBoxForDeadlock(unSafeBoxCostArray);

        return arrayOfMoves;
    }

    calculateBestBoxForDeadlock(unSafeBoxCostArray)
    {
        let maxCost = -10;
        let finalBox = unSafeBoxCostArray[0];
        
        for (var i = 0; i < unSafeBoxCostArray.length; i++) {
            console.log(unSafeBoxCostArray[i].row + ", " + unSafeBoxCostArray[i].col + ", " + unSafeBoxCostArray[i].cost);
            if (unSafeBoxCostArray[i].cost>maxCost)
            {
                maxCost = unSafeBoxCostArray[i].cost;
                finalBox = unSafeBoxCostArray[i];
            }
        }

        let row = finalBox.row;
        let col = finalBox.col;

        let flag = true;

        console.log("best threat: "+row+", "+col);

        if (this.isBoxAvailable(row+1,col)&&(this.breezeKnowledge[row+1][col]==1||this.stenchKnowledge[row+1][col]==1))
        {
            if (this.isBoxAvailable(row+1,col+1)&&this.pathKnowledge[row+1][col+1]==0)
            {
                row = row+1;
                col = col+1;
                flag = false;
            }
            else if (this.isBoxAvailable(row+1,col-1)&&this.pathKnowledge[row+1][col-1]==0)
            {
                row = row+1;
                col = col-1;
                flag = false;
            }
        }
        if (this.isBoxAvailable(row,col+1)&&(this.breezeKnowledge[row][col+1]==1||this.stenchKnowledge[row][col+1]==1)&&flag==true)
        {
            if (this.isBoxAvailable(row+1,col+1)&&this.pathKnowledge[row+1][col+1]==0)
            {
                row = row+1;
                col = col+1;
                flag = false;
            }
            else if (this.isBoxAvailable(row-1,col+1)&&this.pathKnowledge[row-1][col+1]==0)
            {
                row = row-1;
                col = col+1;
                flag = false;
            }
        }
        if (this.isBoxAvailable(row-1,col)&&(this.breezeKnowledge[row-1][col]==1||this.stenchKnowledge[row-1][col]==1)&&flag==true)
        {
            if (this.isBoxAvailable(row-1,col+1)&&this.pathKnowledge[row-1][col+1]==0)
            {
                row = row-1;
                col = col+1;
                flag = false;
            }
            else if (this.isBoxAvailable(row-1,col-1)&&this.pathKnowledge[row-1][col-1]==0)
            {
                row = row-1;
                col = col-1;
                flag = false;
            }
        }
        if (this.isBoxAvailable(row,col-1)&&(this.breezeKnowledge[row][col-1]==1||this.stenchKnowledge[row][col-1]==1)&&flag==true)
        {
            if (this.isBoxAvailable(row+1,col-1)&&this.pathKnowledge[row+1][col-1]==0)
            {
                row = row+1;
                col = col-1;
                flag = false;
            }
            else if (this.isBoxAvailable(row-1,col-1)&&this.pathKnowledge[row-1][col-1]==0)
            {
                row = row-1;
                col = col-1;
                flag = false;
            }
        }

        if (flag==true&&unSafeBoxCostArray.length>1)
        {
            unSafeBoxCostArray.splice(unSafeBoxCostArray.indexOf(finalBox), 1);
            return this.calculateBestBoxForDeadlock(unSafeBoxCostArray);
        }

        let arrayOfMoves = this.calculateQueueOfMoves(row, col);

        this.deadlockBreakingBoxRow=row;
        this.deadlockBreakingBoxCol=col;

        return arrayOfMoves;
    }

    calculateQueueOfMoves(row, col)
    {
        let pathMap = [];
        for (var i = 0; i < this.worldSize; i++) {
            pathMap.push(new Array());
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

        console.log(row+", "+col);

        let arrayOfMoves = this.recursion([this.agentRow, this.agentCol], pathMap, row, col, [], 0);

        arrayOfMoves.shift();

        console.log("Final array of moves: " + arrayOfMoves);

        return arrayOfMoves;

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
    }

    recursion (currentBox, pathMap, row, col, arrayOfMoves, move)
    {
        pathMap[currentBox[0]][currentBox[1]] = -1;
        arrayOfMoves.push(move);
        
        console.log("Array: " + arrayOfMoves);

        // Destination is reached. 
        if (currentBox[0]==row&&currentBox[1]==col)
        {
            return arrayOfMoves;
        }

        let a, b, c, d;

        if (this.isBoxAvailable(currentBox[0]+1,currentBox[1])&&pathMap[currentBox[0]+1][currentBox[1]]==0)
        {
            let a1 = [...arrayOfMoves];
            a = this.recursion([currentBox[0]+1,currentBox[1]], pathMap, row, col, a1, 2);
        }
        if (this.isBoxAvailable(currentBox[0],currentBox[1]+1)&&pathMap[currentBox[0]][currentBox[1]+1]==0)
        {
            let b1 = [...arrayOfMoves];
            b= this.recursion([currentBox[0],currentBox[1]+1], pathMap, row, col, b1, 1);
        }
        if (this.isBoxAvailable(currentBox[0],currentBox[1]-1)&&pathMap[currentBox[0]][currentBox[1]-1]==0)
        {
            let c1 = [...arrayOfMoves];
            c = this.recursion([currentBox[0],currentBox[1]-1], pathMap, row, col, c1, 3);
        }
        if (this.isBoxAvailable(currentBox[0]-1,currentBox[1])&&pathMap[currentBox[0]-1][currentBox[1]]==0)
        {
            let d1 = [...arrayOfMoves];
            d = this.recursion([currentBox[0]-1,currentBox[1]], pathMap, row, col, d1, 0);
        }

        if (a!=null||a!=undefined)
        {
            return a;
        }
        else if (b!=null||b!=undefined)
        {
            return b;
        }
        else if (c!=null||c!=undefined)
        {
            return c;
        }
        else if (d!=null||d!=undefined)
        {
            return d;
        }
    }

    isMoveSafe(row,col) {
        
        if (row==0&&col==0)
        {
            return true;
        }
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
                        // if (this.moves[i]==0)
                        // {
                        //     this.unvisitedSafeBoxMap[this.agentRow-1][this.agentCol]=1;
                        // }
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
                        // if (this.moves[i]==0)
                        // {
                        //     this.unvisitedSafeBoxMap[this.agentRow][this.agentCol+1]=1;
                        // }
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
                        // if (this.moves[i]==0)
                        // {
                        //     this.unvisitedSafeBoxMap[this.agentRow+1][this.agentCol]=1;
                        // }
                    }
                    else
                    {
                        this.moves[i]=-1;
                    }
                }
                if (i==3)
                {
                    //console.log(this.agentRow+", "+this.agentCol-1);
                    if (this.isMoveSafe(this.agentRow,this.agentCol-1)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow][this.agentCol-1];
                        // if (this.moves[i]==0)
                        // {
                        //     this.unvisitedSafeBoxMap[this.agentRow][this.agentCol-1]=1;
                        // }
                    }
                    else
                    {
                        //console.log("Dhukechi");
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