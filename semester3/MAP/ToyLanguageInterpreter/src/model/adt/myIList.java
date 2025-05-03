package model.adt;
import java.util.List;

public interface myIList<T> {
    void add(T item);
    List<T> getAll();
}
