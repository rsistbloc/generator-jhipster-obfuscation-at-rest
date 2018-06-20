package <%=packageName%>.config.obfuscation;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class StringObfuscation implements AttributeConverter<String, String> {


	static String source = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789 ";
	static String target = "Qq5%Aa8(ZzWwSs0=XxEeDdCc6&RrFfVvTt9)GgBbYy4$HhNnUu3£J2MI1KO7LP/";

	public String convertToDatabaseColumn(String value) {
		if (value !=null){
			char[] result = new char[value.length()];
			for (int i = 0; i < value.length(); i++) {
				char c = value.charAt(i);
				int index = source.indexOf(c);
				if (index != -1) {
					result[i] = target.charAt(index);
				} else {
					result[i] = c;
				}
			}
			return new String(result);
		}
		else {
			return null;
		}

	}

	public String convertToEntityAttribute(String value) {
		if (value !=null){
			char[] result = new char[value.length()];
			for (int i = 0; i < value.length(); i++) {
				char c = value.charAt(i);
				int index = target.indexOf(c);
				if (index != -1) {
					result[i] = source.charAt(index);
				} else {
					result[i] = c;
				}
			}
			return new String(result);
		}
		else {
			return null;
		}
	}

}
