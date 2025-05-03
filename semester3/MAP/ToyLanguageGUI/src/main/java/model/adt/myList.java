package model.adt;

import java.util.ArrayList;
import java.util.List;

public class myList<T> implements myIList<T> {
    List<T> list;

    public myList() {
        this.list = new ArrayList<>();
    }

    @Override
    public void add(T element) {
        this.list.add(element);
    }

    @Override
    public List<T> getAll(){
        return this.list;
    }

    @Override
    public String toString() {
        StringBuilder string = new StringBuilder();

        for(T el : this.list){
            string.append(el);
            string.append("\n");
        }

        return "List contains: " + string.toString();
    }
}
