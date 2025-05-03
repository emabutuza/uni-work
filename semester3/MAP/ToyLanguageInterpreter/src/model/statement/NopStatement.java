package model.statement;

import exception.StatementException;
import model.adt.myIMap;
import model.state.ProgramState;
import model.type.IType;

public class NopStatement implements IStatement {
    public NopStatement() {};

    @Override
    public ProgramState execute(ProgramState state) {
        return null;
    }

    public IStatement deepcopy(){
        return new NopStatement();
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException {
        return typeEnv;
    }

    @Override
    public String toString() {
        return "NopStatement";
    }
}
