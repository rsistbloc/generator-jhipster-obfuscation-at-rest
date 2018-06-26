package <%=packageName%>.config.obfuscation;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class IntegerObfuscation implements AttributeConverter<Integer, Integer>{

	private static final int KEY_VALUE = Integer.MAX_VALUE - 2938475;
	
	public Integer convertToDatabaseColumn(Integer value) {
		return Integer.rotateLeft(value, KEY_VALUE);
	}

	public Integer convertToEntityAttribute(Integer value) {
		return Integer.rotateRight(value, KEY_VALUE);
	}

}
