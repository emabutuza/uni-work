package model.statement;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import exception.StatementException;
import model.adt.myIMap;
import model.expression.IExpression;
import model.state.ProgramState;
import model.type.BoolType;
import model.type.IType;
import model.value.BoolValue;
import model.value.IValue;

public class IfStatement implements IStatement {
    private IExpression condition;
    private IStatement thenStatement;
    private IStatement elseStatement;

    public IfStatement(IExpression condition, IStatement thenStatement, IStatement elseStatement) {
        this.condition = condition;
        this.thenStatement = thenStatement;
        this.elseStatement = elseStatement;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementException, ExpressionException, KeyNotFoundException {
        IValue val = condition.evaluate(state.getSymTable(), state.getHeap());
        if(!val.getType().equals(new BoolType()))
            throw new StatementException("The condition is not a boolean");

        if(((BoolValue)val).getValue()){
            state.getExecStack().push(thenStatement);
        }
        else{
            state.getExecStack().push(elseStatement);
        }
        return null;
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        IType type1 = condition.typecheck(typeEnv);
        if(type1.equals(new BoolType()))
        {
            thenStatement.typecheck(typeEnv.clone());
            elseStatement.typecheck(typeEnv.clone());
            return typeEnv;
        }
        else
            throw new StatementException("The condition is not a boolean");
    }

    public IStatement deepcopy(){
        return new IfStatement(condition.deepcopy(),thenStatement.deepcopy(),elseStatement.deepcopy());
    }

    public String toString() {
        return "IF(" + condition.toString() + ") THEN{" + thenStatement.toString() + "} ELSE{" + elseStatement.toString() + "}";
    }
}
