package model.type;

import model.value.BoolValue;
import model.value.IValue;

public class BoolType implements IType {

    @Override
    public boolean equals(IType type) {
        return type instanceof BoolType;
    }

    public String toString() {
        return "bool";
    }

    public IValue getDefaultValue() {
        return new BoolValue(false);
    }

    public IType deepcopy(){
        return new BoolType();
    }
}
