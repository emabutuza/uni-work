package model.adt;

import exception.ExpressionException;
import model.value.IValue;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class myMap<K, V> implements myIMap<K, V> {
    Map<K, V> map;

    public myMap() {
        map = new HashMap<K, V>();
    }

    @Override
    public void insert(K key, V value) {
        this.map.put(key, value);
    }

    @Override
    public void remove(K key) throws ExpressionException {
        if(this.map.containsKey(key))
            this.map.remove(key);
        else
            throw new ExpressionException("Key not found");
    }

    @Override
    public boolean contains(K key) {
        return this.map.containsKey(key);
    }

    @Override
    public V lookup(K key) throws ExpressionException {
        if(this.map.containsKey(key))
            return this.map.get(key);
        else
            throw new ExpressionException("Key not found");
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();
        this.map.forEach((k,v)->{
            str.append(k).append(" -> ").append(v).append("\n");
        });
        return "Dictionary contains: " + str.toString();
    }

    public Set<K> getKeys(){
        return this.map.keySet();
    }

    public Map<K, V> getContent() {
        return this.map;
    }

    @Override
    public void update(K key, V value)  throws ExpressionException {
        if(this.map.containsKey(key))
            this.map.put(key,value);
        else
            throw new ExpressionException("Key not found");
    }

    @Override
    public myIMap<K, V> clone() {
        myMap<K, V> newMap = new myMap<K, V>();
        for (K key : map.keySet()) {
            IValue value = (IValue) map.get(key);
            newMap.insert(key, (V) value.deepcopy());
        }
        return newMap;
    }
}
