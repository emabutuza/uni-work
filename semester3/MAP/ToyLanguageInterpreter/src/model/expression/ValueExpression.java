package model.expression;

import exception.ExpressionException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.type.IType;
import model.value.IValue;

public class ValueExpression implements IExpression{
    private IValue value;

    public ValueExpression(IValue value) {
        this.value = value;
    }

    @Override
    public IValue evaluate(myIMap<String, IValue> symTable, MyIHeap heap) {
        return this.value;
    }

    @Override
    public IType typecheck(myIMap<String, IType> typeEnv) throws ExpressionException {
        return this.value.getType();
    }

    @Override
    public String toString() {
        return this.value.toString();
    }

    public IExpression deepcopy(){
        return new ValueExpression(value.deepcopy());
    }
}
