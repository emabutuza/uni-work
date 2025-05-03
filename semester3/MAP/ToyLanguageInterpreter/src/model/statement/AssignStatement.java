package model.statement;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import exception.StatementException;
import model.adt.myIMap;
import model.expression.IExpression;
import model.state.ProgramState;
import model.type.IType;
import model.value.IValue;

public class AssignStatement implements IStatement{
    private String id;
    private IExpression expression;

    public AssignStatement(String id, IExpression expression) {
        this.id = id;
        this.expression = expression;
    }

    public String toString() {
        return id + "=" + expression;
    }

    public ProgramState execute(ProgramState state) throws ExpressionException, StatementException, KeyNotFoundException {
        if(!state.getSymTable().contains(id))
            throw new StatementException("The variable was not previously declared");
        IValue val = expression.evaluate(state.getSymTable(), state.getHeap());
        if(!val.getType().equals(state.getSymTable().lookup(id).getType()))
            throw new StatementException("The types do not match");

        state.getSymTable().insert(id, val);
        return null;
    }

    public IStatement deepcopy(){
        return new AssignStatement(new String(id),expression.deepcopy());
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        IType typevar = typeEnv.lookup(id);
        IType typexp = expression.typecheck(typeEnv);
        if(typevar.equals(typexp))
            return typeEnv;
        else
            throw new StatementException("Assignment: right hand side and left hand side have different types ");
    }
}
