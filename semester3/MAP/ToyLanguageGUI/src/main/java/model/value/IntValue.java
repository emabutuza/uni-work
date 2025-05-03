package model.value;

import model.type.IType;
import model.type.IntType;

public class IntValue implements IValue {
    private int number;

    public IntValue(int number) {
        this.number = number;
    }

    public int getValue() {
        return number;
    }

    public IType getType(){
        return new IntType();
    }

    @Override
    public boolean equals(IValue object) {
        return object.getType() instanceof IntType && ((IntValue) object).getValue() == this.getValue();
    }

    public IValue deepcopy(){
        return new IntValue(number);
    }

    public String toString() {
        return Integer.toString(number);
    }
}
