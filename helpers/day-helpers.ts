const DayMapping = ["su", "mo", "tu", "we", "th", "fr", "sa"];
const timezone = "Africa/Cairo";

const getCurrentTimeInTimezone = (timezone: string, dstEnabled: boolean): Date => {
	const now = new Date();
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
	const parts = formatter.formatToParts(now);
	const hours = parseInt(parts.find(part => part.type === "hour")?.value || "0", 10);
	const minutes = parseInt(parts.find(part => part.type === "minute")?.value || "0", 10);
	const seconds = parseInt(parts.find(part => part.type === "second")?.value || "0", 10);

	const offsetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
	if (dstEnabled) {
		offsetDate.setHours(offsetDate.getHours() + 1);
	}
	return offsetDate;
};

const isValidDay = (datesInChar: string[] | undefined, dstEnabled: boolean): boolean => {
	const date = getCurrentTimeInTimezone(timezone, dstEnabled);
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
		if (isTimeMoreThanNow(startTime, dstEnabled)) {
			console.error("It's not the working time yet, now is ", getCurrentTimeInTimezone(timezone, dstEnabled));
			return false;
		}
	}

	if (stopTime) {
		if (isTimeLessThanOrEqualToNow(stopTime, dstEnabled)) {
			console.error("The working time is over, now is ", getCurrentTimeInTimezone(timezone, dstEnabled));
			return false;
		}
	}

	return isValidDay(workDays, dstEnabled);
};

export const isTimeLessThanOrEqualToNow = (time: string, dstEnabled: boolean): boolean => {
	const [hours, minutes] = time.split(":").map(Number);
	const now = getCurrentTimeInTimezone(timezone, dstEnabled);
	const givenTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

	return givenTime <= now;
};

export const isTimeMoreThanNow = (time: string, dstEnabled: boolean): boolean => {
	return !isTimeLessThanOrEqualToNow(time, dstEnabled);
};
