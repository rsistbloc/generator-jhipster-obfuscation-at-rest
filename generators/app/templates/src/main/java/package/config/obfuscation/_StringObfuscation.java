package <%=packageName%>.config.obfuscation;

import javax.persistence.AttributeConverter;

public class StringObfuscation implements AttributeConverter<String, String> {

	@Override
	public String convertToDatabaseColumn(String arg0) {
		// arg0 should be obfuscate
		byte[] bytes = arg0.getBytes();
		return new String(invertFirstLast(bytes));
	}

	@Override
	public String convertToEntityAttribute(String arg0) {
		// arg0 should be de-obfuscate
		byte[] bytes = arg0.getBytes();
		return new String(invertFirstLast(bytes));
	}
	
	private byte[] invertFirstLast(byte[] bytes) {
		byte b0 = bytes[0];
		bytes[0] = bytes[bytes.length-1];
		bytes[bytes.length-1] = b0;
		return bytes;
	}

}
