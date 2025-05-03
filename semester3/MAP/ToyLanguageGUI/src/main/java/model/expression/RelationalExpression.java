package model.expression;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.type.BoolType;
import model.type.IType;
import model.type.IntType;
import model.value.BoolValue;
import model.value.IValue;
import model.value.IntValue;

public class RelationalExpression implements IExpression{
    private IExpression left;
    private IExpression right;
    private String op;

    public RelationalExpression(IExpression e1, String op, IExpression e2) {
        this.left = e1;
        this.right = e2;
        this.op = op;
    }

    @Override
    public IValue evaluate(myIMap<String, IValue> symTable, MyIHeap heap) throws ExpressionException, KeyNotFoundException {
        IValue left = this.left.evaluate(symTable, heap);
        IValue right = this.right.evaluate(symTable, heap);

        if(!left.getType().equals(new IntType()))
            throw new ExpressionException("The left operand is not an integer!");
        if(!right.getType().equals(new IntType()))
            throw new ExpressionException("The right operand is not an integer!");

        int leftValue = ((IntValue)left).getValue();
        int rightValue = ((IntValue)right).getValue();

        switch(op) {
            case "==" -> {
                return new BoolValue(leftValue == rightValue);
            }
            case "!=" -> {
                return new BoolValue(leftValue != rightValue);
            }
            case "<" -> {
                return new BoolValue(leftValue < rightValue);
            }
            case "<=" -> {
                return new BoolValue(leftValue <= rightValue);
            }
            case ">" -> {
                return new BoolValue(leftValue > rightValue);
            }
            case ">=" -> {
                return new BoolValue(leftValue >= rightValue);
            }
            default-> {
                throw new ExpressionException("Invalid operator!");
            }
        }
    }

    @Override
    public IType typecheck(myIMap<String, IType> typeEnv) throws ExpressionException {
        IType type1, type2;
        type1 = left.typecheck(typeEnv);
        type2 = right.typecheck(typeEnv);

        if(type1.equals(new IntType())) {
            if(type2.equals(new IntType())) {
                return new BoolType();
            }
            else {
                throw new ExpressionException("Second operand is not an integer!");
            }
        }
        else {
            throw new ExpressionException("First operand is not an integer!");
        }
    }

    public IExpression deepcopy() {
        return new RelationalExpression(left.deepcopy(), op, right.deepcopy());
    }

    public String toString() {
        return left.toString() + op + right.toString();
    }
}
