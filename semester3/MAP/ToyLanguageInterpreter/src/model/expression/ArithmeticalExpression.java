package model.expression;

import exception.ExpressionException;
import exception.KeyNotFoundException;
import model.adt.MyIHeap;
import model.adt.myIMap;
import model.type.IType;
import model.type.IntType;
import model.value.IValue;
import model.value.IntValue;

public class ArithmeticalExpression implements IExpression {
    private IExpression left;
    private IExpression right;
    private ArithmeticalOperation operation;

    public ArithmeticalExpression(char operation, IExpression left, IExpression right){
        this.left = left;
        this.right = right;
        switch(operation){
            case '+' -> {
                this.operation = ArithmeticalOperation.PLUS;
            }

            case '-' -> {
                this.operation = ArithmeticalOperation.MINUS;
            }

            case '*' -> {
                this.operation = ArithmeticalOperation.MULTIPLY;
            }

            case '/' -> {
                this.operation = ArithmeticalOperation.DIVIDE;
            }

            default -> {
                this.operation = null;
            }
        }
    }

    public ArithmeticalExpression(ArithmeticalOperation operation, IExpression left, IExpression right) {
        this.left = left;
        this.right = right;
        this.operation = operation;
    }

    @Override
    public IValue evaluate(myIMap<String, IValue> symTable, MyIHeap heap) throws ExpressionException, KeyNotFoundException {
        IValue leftValue = left.evaluate(symTable, heap);
        IValue rightValue = right.evaluate(symTable, heap);

        if(!leftValue.getType().equals(new IntType()) || !rightValue.getType().equals(new IntType()))
            throw new ExpressionException("Invalid expressions");

        int intLeftValue = ((IntValue) leftValue).getValue();
        int intRightValue = ((IntValue) rightValue).getValue();

        switch(operation){
            case PLUS -> {
                return new IntValue(intLeftValue + intRightValue);
            }
            case MINUS -> {
                return new IntValue(intLeftValue - intRightValue);
            }
            case MULTIPLY -> {
                return new IntValue(intLeftValue * intRightValue);
            }
            case DIVIDE -> {
                if(intRightValue == 0)
                    throw new ExpressionException("Division by zero");
                return new IntValue(intLeftValue / intRightValue);
            }
            default -> {
                throw new ExpressionException("Invalid operation");
            }
        }
    }

    public String enumToString() {
        switch(this.operation){
            case PLUS -> {
                return "+";
            }
            case MINUS -> {
                return "-";
            }
            case MULTIPLY -> {
                return "*";
            }
            case DIVIDE -> {
                return "/";
            }
            default -> {
                return "";
            }
        }
    }


    @Override
    public IType typecheck(myIMap<String, IType> typeEnv) throws ExpressionException {
        IType type1, type2;
        type1 = left.typecheck(typeEnv);
        type2 = right.typecheck(typeEnv);

        if(type1.equals(new IntType())){
            if(type2.equals(new IntType())){
                return new IntType();
            }
            else{
                throw new ExpressionException("Second operand is not an integer");
            }
        }
        else{
            throw new ExpressionException("First operand is not an integer");
        }
    }

    @Override
    public String toString() {
        return this.left.toString() + enumToString() + this.right.toString();
    }

    public IExpression deepcopy(){
        return new ArithmeticalExpression(operation, left.deepcopy(), right.deepcopy());
    }
}
