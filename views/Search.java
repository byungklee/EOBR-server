import java.util.*;

public class Search {

	/*Find element in an array which have elements in first increasing
	   and then decreasing order.*/
	public static int findMaxElement(int[] array) {
		/* Algorithm is
			1. if the mid element is bigger than adjacent element,
				found.
			2. if the mid element is bigger than left element and
			small than right element, max is on the right.
			3. if the mid element is small than left and bigger than right,
			max is on the left. 
			*/
		int midIndex = array.length/2;
		int midValue = array[array.length/2];
		int leftValue = array[array.length/2-1];
		int rightValue = arrayarray[array.length/2+1]
		if(midValue > leftValue && rightValue < midValue) {
			return midValue;
		} else if(midValue > leftValue && midValue < rightValue){
 			return findMaxElement(Arrays.copyOfRange(arrays,,array.));
		} else {
			return findMaxElement(Arrays.copyOfRange(arrays,0,leftValue));
		}

	}
	public static void findElement(int[] array, int value) {

	}



	public static void main(String[] args) {
		int[] myArray = {1, 3, 4, 8, 12, 17, 18, 15 ,14, 7,2 };
		findMaxElement(myArray);

	}

}