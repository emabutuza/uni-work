package model.adt;

import exception.ExpressionException;
import model.value.IValue;

import java.util.Map;
import java.util.Set;

public interface myIMap<K, V> {
    void insert(K key, V value);
    void remove(K key) throws ExpressionException;
    boolean contains(K key);
    public V lookup(K key) throws ExpressionException;
    Set<K> getKeys();
    public Map<K,V> getContent();
    public void update(K key, V value) throws ExpressionException;

    public myIMap<K, V> clone();
}
