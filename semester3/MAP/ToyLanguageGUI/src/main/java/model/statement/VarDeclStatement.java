package model.statement;

import exception.ExpressionException;
import exception.StatementException;
import model.adt.myIMap;
import model.state.ProgramState;
import model.type.IType;

public class VarDeclStatement implements IStatement {
    private String name;
    private IType type;

    public VarDeclStatement(String name, IType type) {
        this.name = name;
        this.type = type;
    }

    public ProgramState execute(ProgramState state) throws StatementException {
        if(state.getSymTable().contains(this.name)) throw new StatementException("Variable already declared");
        state.getSymTable().insert(this.name, this.type.getDefaultValue());
        return null;
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException {
        typeEnv.insert(name, type);
        return typeEnv;
    }

    public IStatement deepcopy(){
        return new VarDeclStatement(new String(name),type.deepcopy());
    }

    @Override
    public String toString() {
        return this.type.toString() + " " + this.name;
    }
}
