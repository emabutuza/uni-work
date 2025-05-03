package model.expression;

import exception.ExpressionException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.type.IType;
import model.value.IValue;

public class VariableExpression implements IExpression {
    private String variable;

    public VariableExpression(String variable) {
        this.variable = variable;
    }

    @Override
    public IValue evaluate(myIMap<String, IValue> symTable, MyIHeap heap) throws ExpressionException {
        return symTable.lookup(this.variable);
    }

    @Override
    public IType typecheck(myIMap<String, IType> typeEnv) throws ExpressionException {
        return typeEnv.lookup(this.variable);
    }

    @Override
    public String toString() {
        return this.variable;
    }

    public IExpression deepcopy(){
        return new VariableExpression(new String(variable));
    }
}
