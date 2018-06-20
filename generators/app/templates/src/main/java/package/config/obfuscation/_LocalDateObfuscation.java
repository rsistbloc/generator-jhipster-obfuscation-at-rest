package <%=packageName%>.config.obfuscation;

import java.time.LocalDate;
import java.util.Arrays;
import java.sql.Date;
import java.util.List;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class LocalDateObfuscation implements AttributeConverter<LocalDate, Date>{

	
	private static final List<Integer> monthSource = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
	private static final List<Integer> monthTarget = Arrays.asList(5, 2, 1, 4, 10, 6, 3, 12, 9, 7, 11, 8);
	
	private static final int key = 565;
	
	public Date convertToDatabaseColumn(LocalDate value) {
		if (value != null){
			int month = value.getMonthValue();
			int index = monthSource.indexOf(month);
			int resultMonth = monthTarget.get(index);
			
			LocalDate newDate = LocalDate.of(value.getYear(), resultMonth, value.getDayOfMonth());
			
			LocalDate result = newDate.plusDays(key);
			
			return Date.valueOf(result);
			
		}else{
			return null;
		}
		
	}

	public LocalDate convertToEntityAttribute(Date value) {
		if (value != null){
			LocalDate newDate = value.toLocalDate().minusDays(key);
			
			int month = newDate.getMonthValue();
			int index = monthTarget.indexOf(month);
			int resultMonth = monthSource.get(index);
			
			LocalDate result = LocalDate.of(newDate.getYear(), resultMonth, newDate.getDayOfMonth());
			
			return result;
		}
		else{
			return null;
		}

	}

}