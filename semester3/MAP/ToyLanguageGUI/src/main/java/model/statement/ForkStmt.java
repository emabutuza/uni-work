package model.statement;

import exception.ExpressionException;
import exception.StatementException;
import model.adt.myIMap;
import model.adt.myIStack;
import model.adt.myStack;
import model.state.ProgramState;
import model.type.IType;
import model.value.IValue;

public class ForkStmt implements IStatement {
    private IStatement statement;

    public ForkStmt(IStatement stmt) {
        this.statement = stmt;
    }

    @Override
    public ProgramState execute(ProgramState state) {
        myIStack<IStatement> newStack = new myStack<IStatement>();
        myIMap<String, IValue> newSymTable = state.getSymTable().clone();
        return new ProgramState(statement, newStack, newSymTable, state.getOutputList(), state.getFileTable(), state.getHeap());
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        return statement.typecheck(typeEnv);
    }

    @Override
    public IStatement deepcopy() {
        return new ForkStmt(statement.deepcopy());
    }

    @Override
    public String toString() {
        return "fork(" + statement.toString() + ")";
    }
}
