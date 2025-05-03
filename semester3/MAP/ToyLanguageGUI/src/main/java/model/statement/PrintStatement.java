package model.statement;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import exception.StatementException;
import model.adt.myIMap;
import model.expression.IExpression;
import model.state.ProgramState;
import model.type.IType;
import model.value.IValue;

public class PrintStatement implements IStatement {
    private IExpression expression;

    public PrintStatement(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public ProgramState execute(ProgramState state) throws ExpressionException, KeyNotFoundException {
        IValue val = expression.evaluate(state.getSymTable(), state.getHeap());
        state.getOutputList().add(val);
        return null;
    }

    @Override
    public myIMap<String, IType> typecheck(myIMap<String, IType> typeEnv) throws StatementException, ExpressionException {
        expression.typecheck(typeEnv);
        return typeEnv;
    }

    public IStatement deepcopy(){
        return new PrintStatement(expression.deepcopy());
    }

    @Override
    public String toString() {
        return "print(" + expression.toString() + ")";
    }
}
