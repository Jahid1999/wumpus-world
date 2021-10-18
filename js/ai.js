class Ai {

    constructor(wholeWorldKnowledge) {
        
        this.wholeWorldKnowledge=wholeWorldKnowledge;
        this.worldSize=this.wholeWorldKnowledge.roomsPerRow;
        this.agentRow=0;
        this.agentCol=0;
        this.pathKnowledge=[];
        this.pathKnowledgeInitialization();
        this.moves=[0,0,0,0];
        this.stenchKnowledge=[];
        this.breezeKnowledge=[];
        this.knowledgeBaseInitialization();
        this.deadlockBreakingBoxRow=0;
        this.deadlockBreakingBoxCol=0;
        this.safeBoxMap=[];
        this.safeBoxMapInitialization();
        this.wumpusAlive = true;
        this.killWumpus = false;
    }

    safeBoxMapInitialization() {
        for (var i = 0; i < this.worldSize; i++) {
            this.safeBoxMap.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
               this.safeBoxMap[i].push(-1);
            }
        }

        this.safeBoxMap[0][0]=1;
    }

    pathKnowledgeInitialization() {

        for (var i = 0; i < this.worldSize; i++) {
            this.pathKnowledge.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
               this.pathKnowledge[i].push(0);
            }
        }
        this.pathKnowledge[0][0]=1;
    }

    knowledgeBaseInitialization() {

        for (var i = 0; i < this.worldSize; i++) {
            this.breezeKnowledge.push(new Array());
            this.stenchKnowledge.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
                this.breezeKnowledge[i].push(0);
                this.stenchKnowledge[i].push(0);
            }
        }
        this.breezeKnowledge[0][0]=-1;
        this.stenchKnowledge[0][0]=-1;
    }

    ifShootWumpus() {
        let stenchCounter = 0;
        let numberOfAvailableBoxes = 0;
        let stenchData = [];
        for (var i = 0; i < this.worldSize; i++) {
            for (var j = 0; j < this.worldSize; j++) {
                stenchCounter=0;
                numberOfAvailableBoxes = 0;
                if (this.isBoxAvailable(i+1,j))
                {
                    numberOfAvailableBoxes++;
                    if (this.stenchKnowledge[i+1][j]==1)
                    {
                        stenchCounter++;
                    }
                    else if (this.stenchKnowledge[i+1][j]==-1)
                    {
                        continue;
                    }
                }
                if (this.isBoxAvailable(i-1,j))
                {
                    numberOfAvailableBoxes++;
                    if (this.stenchKnowledge[i-1][j]==1)
                    {
                        stenchCounter++;
                    }
                    else if (this.stenchKnowledge[i-1][j]==-1)
                    {
                        continue;
                    }
                }
                if (this.isBoxAvailable(i,j+1))
                {
                    numberOfAvailableBoxes++;
                    if (this.stenchKnowledge[i][j+1]==1)
                    {
                        stenchCounter++;
                    }
                    else if (this.stenchKnowledge[i][j+1]==-1)
                    {
                        continue;
                    }
                }
                if (this.isBoxAvailable(i,j-1))
                {
                    numberOfAvailableBoxes++;
                    if (this.stenchKnowledge[i][j-1]==1)
                    {
                        stenchCounter++;
                    }
                    else if (this.stenchKnowledge[i][j-1]==-1)
                    {
                        continue;
                    }
                }

                let wumpusBox = new Unsafeboxcost (i, j, parseFloat(stenchCounter/numberOfAvailableBoxes));

                stenchData.push(wumpusBox);
            }
        }

        let maxCost = -10;
        let finalBox = stenchData[0];
        
        for (var i = 0; i < stenchData.length; i++) {
            if (stenchData[i].cost>maxCost)
            {
                maxCost = stenchData[i].cost;
                finalBox = stenchData[i];
            }
        }

        let row = finalBox.row;
        let col = finalBox.col;

        if (finalBox.cost==0)
        {
            return [-1,-1];
        }
        else
        {
            return [row,col];
        }
    }

    handleWumpusKilling(nextMoveArray) {
        let wumpusBox = this.ifShootWumpus();
        if (!(wumpusBox[0]==-1||wumpusBox[1]==-1))
        {
            let row = wumpusBox[0];
            let col = wumpusBox[1];

            nextMoveArray = [];

            nextMoveArray = this.calculateQueueOfMoves(row, col);

            this.deadlockBreakingBoxRow = row;
            this.deadlockBreakingBoxCol = col;

            this.updateStenchAfterKillingWumpus(row, col);

            this.killWumpus = true;

            return nextMoveArray;
        }

        return nextMoveArray;
    }

    updateStenchAfterKillingWumpus(row, col) {
      
        if (this.wholeWorldKnowledge.getRoom(col,row).containsWumpus())
        {
            if (this.isBoxAvailable(row,col+1))
            {
                this.stenchKnowledge[row][col+1]=-1;
            }
            if (this.isBoxAvailable(row+1,col))
            {
                this.stenchKnowledge[row+1][col]=-1;
            }     
            if (this.isBoxAvailable(row-1,col))
            {
                this.stenchKnowledge[row-1][col]=-1;
            }        
            if (this.isBoxAvailable(row,col-1))
            {
                this.stenchKnowledge[row][col-1]=-1;
            }

            this.wumpusAlive = false;
        }
    }

    getNextMove() {
        this.calculateAvailableMoves();
        this.calculateSafeMoves();
        let nextMoveArray = this.finalMove();

        if (!this.isDeadlock())
        {

            if (nextMoveArray.length>1)
            {
                this.updateKnowledgeBase(this.deadlockBreakingBoxRow, this.deadlockBreakingBoxCol);
                this.agentRow=this.deadlockBreakingBoxRow;
                this.agentCol=this.deadlockBreakingBoxCol;
            }
            else
            {
                if(nextMoveArray[0]==0)
                {
                    this.updateKnowledgeBase(this.agentRow-1,this.agentCol);
                    this.agentRow=this.agentRow-1;
                }
                if(nextMoveArray[0]==1)
                {
                    this.updateKnowledgeBase(this.agentRow,this.agentCol+1);
                    this.agentCol=this.agentCol+1;
                }
                if(nextMoveArray[0]==2)
                {
                    this.updateKnowledgeBase(this.agentRow+1,this.agentCol);
                    this.agentRow=this.agentRow+1;
                }
                if(nextMoveArray[0]==3)
                {
                    this.updateKnowledgeBase(this.agentRow,this.agentCol-1);
                    this.agentCol=this.agentCol-1;
                }
            }
            
            
        }
        else
        {
            nextMoveArray = this.handleWumpusKilling(nextMoveArray);
            this.updateKnowledgeBase(this.deadlockBreakingBoxRow, this.deadlockBreakingBoxCol);
            this.agentRow=this.deadlockBreakingBoxRow;
            this.agentCol=this.deadlockBreakingBoxCol;
        }

        this.safeBoxMap[this.agentRow][this.agentCol]=1;
        
        this.moves=[0,0,0,0];
        return nextMoveArray;
    }

    updateKnowledgeBase(row, col) {
        this.pathKnowledge[row][col]++;
        if (this.wholeWorldKnowledge.getRoom(col,row).containsBreeze())
        {
            this.breezeKnowledge[row][col]=1;
        }
        else
        {
            this.breezeKnowledge[row][col]=-1;
        }

        if (this.wholeWorldKnowledge.getRoom(col,row).containsStench()&&this.wumpusAlive==true)
        {
            this.stenchKnowledge[row][col]=1;
        }
        else
        {
            this.stenchKnowledge[row][col]=-1;
        }
    }

    isDeadlock()
    {
        let flagForDeadlock = true;
        for (let i=0; i<this.safeBoxMap.length; i++)
        {
            for (let j=0; j<this.safeBoxMap.length; j++)
            {
                if (this.safeBoxMap[i][j]==0)
                {
                    flagForDeadlock = false;
                }
            }
        }

        return flagForDeadlock;
    }

    finalMove() {
        let bestMove = 0;
        let bestMoveArray = [];
        let bestMoveCost = 9999999;
        for (var i = 0; i < this.moves.length; i++) {
            if (this.moves[i]>-1)
            {
                if(this.moves[i]<bestMoveCost)
                {
                    bestMove = i;
                    bestMoveCost=this.moves[i];
                }
            }
        }

        if (this.isDeadlock())
        {
            bestMoveArray = this.handleDeadlockSituation();
        }
        else if (bestMoveCost>0)
        {
            let minimumDistance = 99999;
            let minRow;
            let minCol;
            for (var i = 0; i < this.worldSize; i++) {
                for (var j = 0; j < this.worldSize; j++) {
                   if (this.safeBoxMap[i][j]==0)
                   {
                       if ((((this.agentRow-i)*(this.agentRow-i))+((this.agentCol-j)*(this.agentCol-j)))<minimumDistance)
                       {
                           minimumDistance = ((this.agentRow-i)*(this.agentRow-i))+((this.agentCol-j)*(this.agentCol-j));
                           minRow = i;
                           minCol = j;
                       }
                   }
                }
            }

            bestMoveArray = this.calculateQueueOfMoves(minRow, minCol);

            this.deadlockBreakingBoxRow = minRow;
            this.deadlockBreakingBoxCol = minCol;
        }
        else
        {
            bestMoveArray.push(bestMove);
        }

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
                            numberOfThreats = (numberOfThreats+1)*(numberOfThreats+1);
                        }
                        if(this.stenchKnowledge[row][col+1]==1)
                        {
                            numberOfThreats = (numberOfThreats+1)*(numberOfThreats+1);
                        }
                    }
                    if (this.isBoxAvailable(row+1,col))
                    {
                        numberOfAvailableBoxes++;
                        if(this.breezeKnowledge[row+1][col]==1)
                        {
                            numberOfThreats = (numberOfThreats+1)*(numberOfThreats+1);
                        }
                        if(this.stenchKnowledge[row+1][col]==1)
                        {
                            numberOfThreats = (numberOfThreats+1)*(numberOfThreats+1);
                        }
                    }
                    if (this.isBoxAvailable(row-1,col))
                    {
                        numberOfAvailableBoxes++;
                        if(this.breezeKnowledge[row-1][col]==1)
                        {
                            numberOfThreats = (numberOfThreats+1)*(numberOfThreats+1);
                        }
                        if(this.stenchKnowledge[row-1][col]==1)
                        {
                            numberOfThreats = (numberOfThreats+1)*(numberOfThreats+1);
                        }
                    }
                    if (this.isBoxAvailable(row,col-1))
                    {
                        numberOfAvailableBoxes++;
                        if(this.breezeKnowledge[row][col-1]==1)
                        {
                            numberOfThreats = (numberOfThreats+1)*(numberOfThreats+1);
                        }
                        if(this.stenchKnowledge[row][col-1]==1)
                        {
                            numberOfThreats = (numberOfThreats+1)*(numberOfThreats+1);
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
            if (unSafeBoxCostArray[i].cost>maxCost)
            {
                maxCost = unSafeBoxCostArray[i].cost;
                finalBox = unSafeBoxCostArray[i];
            }
        }

        let row = finalBox.row;
        let col = finalBox.col;

        let flag = true;

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

        let arrayOfMoves = this.recursion([this.agentRow, this.agentCol], pathMap, row, col, [], 0);

        arrayOfMoves.shift();

        return arrayOfMoves;
    }

    recursion (currentBox, pathMap, row, col, arrayOfMoves, move)
    {
        pathMap[currentBox[0]][currentBox[1]] = -1;
        arrayOfMoves.push(move);
 
        if (currentBox[0]==row&&currentBox[1]==col)
        {
            return arrayOfMoves;
        }

        let a, b, c, d;

        if (this.isBoxAvailable(currentBox[0],currentBox[1]-1)&&pathMap[currentBox[0]][currentBox[1]-1]==0)
        {
            let c1 = [...arrayOfMoves];
            let pathMapC = [...pathMap];
            c = this.recursion([currentBox[0],currentBox[1]-1], pathMapC, row, col, c1, 3);
        }
        if (this.isBoxAvailable(currentBox[0]+1,currentBox[1])&&pathMap[currentBox[0]+1][currentBox[1]]==0)
        {
            let a1 = [...arrayOfMoves];
            let pathMapA = [...pathMap];
            a = this.recursion([currentBox[0]+1,currentBox[1]], pathMapA, row, col, a1, 2);
        }
        if (this.isBoxAvailable(currentBox[0],currentBox[1]+1)&&pathMap[currentBox[0]][currentBox[1]+1]==0)
        {
            let b1 = [...arrayOfMoves];
            let pathMapB = [...pathMap];
            b= this.recursion([currentBox[0],currentBox[1]+1], pathMapB, row, col, b1, 1);
        }
        if (this.isBoxAvailable(currentBox[0]-1,currentBox[1])&&pathMap[currentBox[0]-1][currentBox[1]]==0)
        {
            let d1 = [...arrayOfMoves];
            let pathMapD = [...pathMap];
            d = this.recursion([currentBox[0]-1,currentBox[1]], pathMapD, row, col, d1, 0);
        }

        // let resultArray = [];

        if (a!=null||a!=undefined)
        {
            return a; //resultArray.push(a);
        }
        else if (b!=null||b!=undefined)
        {
            return b; //resultArray.push(b);
        }
        else if (c!=null||c!=undefined)
        {
            return c; //resultArray.push(c);
        }
        else if (d!=null||d!=undefined)
        {
            return d; //resultArray.push(d);
        }

        // let size = 99999;

        // let finalMoves;

        // for (let i=0; i<resultArray.length; i++)
        // {
        //     if (resultArray[i].length<size)
        //     {
        //         finalMoves = resultArray[i];
        //         size = resultArray[i].length;
        //     }
        // }

        // if (finalMoves!=null||finalMoves!=undefined)
        // {
        //     return finalMoves;
        // }
    }

    isMoveSafe(row,col) {
        
        if (row==this.deadlockBreakingBoxRow&&col==this.deadlockBreakingBoxCol)
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
                        if (this.moves[i]==0)
                        {
                            this.safeBoxMap[this.agentRow-1][this.agentCol]=0;
                        }
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
                        if (this.moves[i]==0)
                        {
                            this.safeBoxMap[this.agentRow][this.agentCol+1]=0;
                        }
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
                        if (this.moves[i]==0)
                        {
                            this.safeBoxMap[this.agentRow+1][this.agentCol]=0;
                        }
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
                        if (this.moves[i]==0)
                        {
                            this.safeBoxMap[this.agentRow][this.agentCol-1]=0;
                        }
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