export const isValidTimeRange = (startTime: string | undefined, stopTime: string | undefined): boolean => {
	if (startTime) {
		// Compare the given time with the current time
		if (isTimeMoreThanNow(startTime)) {
			return false;
		}
	}

	if (stopTime) {
		// Compare the given time with the current time
		if (isTimeLessThanOrEqualToNow(stopTime)) {
			return false;
		}
	}
	return true;
};

export const isTimeLessThanOrEqualToNow = (time: string) => {
	// Split the given time into hours and minutes
	const [hours, minutes] = time.split(":").map(Number);

	// Get the current date and time
	const now = new Date();

	// Create a date object for the given time on the current date
	const givenTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

	// Compare the given time with the current time
	return givenTime <= now;
};

export const isTimeMoreThanNow = (time: string) => {
	return !isTimeLessThanOrEqualToNow(time);
};
