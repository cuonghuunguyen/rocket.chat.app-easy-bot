const DayMapping = ["mo", "tu", "we", "th", "fr", "sa", "su"];

const isValidDay = (datesInChar: string[] | undefined, dstEnabled: boolean): boolean => {
	const date = new Date(Date.now() + (dstEnabled ? 3600000 : 0));
	const day = date.getDay();
	console.log("TODAY: ", day, datesInChar, datesInChar?.includes(DayMapping[day]));
	return !datesInChar || datesInChar.includes(DayMapping[day]);
};

export const isValidTimeRange = (
	startTime: string | undefined,
	stopTime: string | undefined,
	workDays: string[] | undefined,
	dstEnabled: boolean
): boolean => {
	if (startTime) {
		// Compare the given time with the current time
		if (isTimeMoreThanNow(startTime, dstEnabled)) {
			console.error("It's not the working time yet");
			return false;
		}
	}

	if (stopTime) {
		// Compare the given time with the current time
		if (isTimeLessThanOrEqualToNow(stopTime, dstEnabled)) {
			console.error("The working time is over");
			return false;
		}
	}

	return isValidDay(workDays, dstEnabled);
};

export const isTimeLessThanOrEqualToNow = (time: string, dstEnabled: boolean) => {
	// Split the given time into hours and minutes
	// eslint-disable-next-line prefer-const
	let [hours, minutes] = time.split(":").map(Number);

	if (dstEnabled) {
		hours -= 1;
	}

	// Get the current date and time
	const now = new Date();

	// Create a date object for the given time on the current date
	const givenTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

	// Compare the given time with the current time
	return givenTime <= now;
};

export const isTimeMoreThanNow = (time: string, dtsEnabled: boolean) => {
	return !isTimeLessThanOrEqualToNow(time, dtsEnabled);
};
