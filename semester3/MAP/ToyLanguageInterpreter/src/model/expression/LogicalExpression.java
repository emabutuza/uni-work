package model.expression;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.type.BoolType;
import model.type.IType;
import model.value.BoolValue;
import model.value.IValue;


public class LogicalExpression implements IExpression {
    private IExpression left;
    private IExpression right;
    private LogicalOperation operation;

    public LogicalExpression(IExpression left, LogicalOperation operation, IExpression right) {
        this.left = left;
        this.operation = operation;
        this.right = right;
    }

    @Override
    public String toString() {
        return left.toString() + " " + operation.toString().toLowerCase() + " " + right.toString();
    }

    public IValue evaluate(myIMap<String, IValue> symTable, MyIHeap heap) throws ExpressionException, KeyNotFoundException {
        IValue left = this.left.evaluate(symTable, heap);
        IValue right = this.right.evaluate(symTable, heap);

        if(!left.getType().equals(new BoolType()) && !right.getType().equals(new BoolType()))
            throw new ExpressionException("The values are not boolean");

        Boolean leftValue = ((BoolValue)(left)).getValue();
        Boolean rightValue = ((BoolValue)(right)).getValue();

        if(operation == LogicalOperation.AND){
            return new BoolValue(leftValue && rightValue);
        }
        else
            return new BoolValue(leftValue || rightValue);
    }

    @Override
    public IType typecheck(myIMap<String, IType> typeEnv) throws ExpressionException {
        IType leftType = left.typecheck(typeEnv);
        IType rightType = right.typecheck(typeEnv);
        if(leftType.equals(new BoolType()) && rightType.equals(new BoolType())){
            return new BoolType();
        }
        else{
            throw new ExpressionException("The values are not boolean!");
        }
    }

    public IExpression deepcopy(){
        return new LogicalExpression(left.deepcopy(), operation, right.deepcopy());
    }
}
