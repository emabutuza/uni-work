package model.expression;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.type.IType;
import model.value.IValue;

public interface IExpression {
    IValue evaluate(myIMap<String, IValue> symTable, MyIHeap heap) throws ExpressionException, KeyNotFoundException;
    IType typecheck(myIMap<String, IType> typeEnv) throws ExpressionException;
    IExpression deepcopy();
}
