//var List = require("collections/list");

class Ai {

    constructor(wholeWorldKnowledge, worldSize) {
        
        this.wholeWorldKnowledge=wholeWorldKnowledge;
        this.worldSize=worldSize;
        this.agentRow=0;
        this.agentCol=0;
        this.pathKnowledge=[];
        this.moves=[0,0,0,0];
        this.knowledgeBase=new KnowledgeBase();
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
            this.knowledgeBase.breezeKnowledge.push(new Array());
            this.knowledgeBase.stenchKnowledge.push(new Array());
            for (var j = 0; j < this.worldSize; j++) {
                this.knowledgeBase.breezeKnowledge[i].push(0);
                this.knowledgeBase.stenchKnowledge[i].push(0);
            }
            this.knowledgeBase.breezeKnowledge[0][0]=-1;
            this.knowledgeBase.stenchKnowledge[0][0]=-1;
        }
    }

    getNextMove() {

        this.calculateAvailableMoves();
        this.calculateSafeMoves();
        let nextMove = this.finalMove();
        if(nextMove==0)
        {
            this.updateKnowledgeBase(this.agentRow-1,this.agentCol);
        }
        if(nextMove==1)
        {
            this.updateKnowledgeBase(this.agentRow,this.agentCol+1);
        }
        if(nextMove==2)
        {
            this.updateKnowledgeBase(this.agentRow+1,this.agentCol);
        }
        if(nextMove==3)
        {
            this.updateKnowledgeBase(this.agentRow,this.agentCol-1);
        }
        return nextMove;
    }

    updateKnowledgeBase(row, col) {
        this.knowledgeBase.breezeKnowledge[row][col]=this.wholeWorldKnowledge.breezeKnowledge[row][col];
        this.knowledgeBase.stenchKnowledge[row][col]=this.wholeWorldKnowledge.stenchKnowledge[row][col];
    }

    finalMove() {
        let bestMove = 0;
        let bestMoveCost = 9999999;
        for (var i = 0; i < this.moves.length; i++) {
            if (this.moves[i]>0)
            {
                if(this.moves[i]<bestMoveCost)
                {
                    bestMove=i;
                    bestMoveCost=this.moves[i];
                }
            }
        }

        return bestMove;
    }

    isMoveSafe(row,col) {
        if((this.knowledgeBase.breezeKnowledge[row][col+1]==-1&&this.knowledgeBase.stenchKnowledge[row][col+1]==-1)
            ||(this.knowledgeBase.breezeKnowledge[row+1][col]==-1&&this.knowledgeBase.stenchKnowledge[row+1][col]==-1)
            ||(this.knowledgeBase.breezeKnowledge[row-1][col]==-1&&this.knowledgeBase.stenchKnowledge[row-1][col]==-1)
            ||(this.knowledgeBase.breezeKnowledge[row][col-1]==-1&&this.knowledgeBase.stenchKnowledge[row][col-1]==-1))
        {
            return true;
        }

        return false;
    }

    calculateSafeMoves() {
        for (var i = 0; i < this.moves.length; i++) {
            if (this.moves[i]!=-1)
            {
                if (i==0)
                {
                    if (isMoveSafe(this.agentRow-1,this.agentCol)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow-1,this.agentCol];
                    }
                }
                if (i==1)
                {
                    if (isMoveSafe(this.agentRow,this.agentCol+1)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow,this.agentCol+1];
                    }
                }
                if (i==2)
                {
                    if (isMoveSafe(this.agentRow+1,this.agentCol)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow+1,this.agentCol];
                    }
                }
                if (i==3)
                {
                    if (isMoveSafe(this.agentRow,this.agentCol-1)==true)
                    {
                        this.moves[i]=this.pathKnowledge[this.agentRow,this.agentCol-1];
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