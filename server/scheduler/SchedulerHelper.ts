class SchedulerHelper {
  private static validateTime(time: string): void {
    const timeParts = time.split(':');
    if (timeParts.length !== 2 ||
      isNaN(parseInt(timeParts[0])) ||
      isNaN(parseInt(timeParts[1])) ||
      parseInt(timeParts[0]) < 0 || parseInt(timeParts[0]) > 23 ||
      parseInt(timeParts[1]) < 0 || parseInt(timeParts[1]) > 59) {
      throw new Error(`Invalid time format: ${time}. Expected HH:MM.`);
    }
  }

  static everySecond(): string {
    return '* * * * * *';
  }

  static everyTwoSeconds(): string {
    return '*/2 * * * * *';
  }

  static everyFiveSeconds(): string {
    return '*/5 * * * * *';
  }

  static everyTenSeconds(): string {
    return '*/10 * * * * *';
  }

  static everyFifteenSeconds(): string {
    return '*/15 * * * * *';
  }

  static everyTwentySeconds(): string {
    return '*/20 * * * * *';
  }

  static everyThirtySeconds(): string {
    return '*/30 * * * * *';
  }

  static everyMinute(): string {
    return '0 * * * *';
  }

  static everyTwoMinutes(): string {
    return '*/2 * * * *';
  }

  static everyThreeMinutes(): string {
    return '*/3 * * * *';
  }

  static everyFourMinutes(): string {
    return '*/4 * * * *';
  }

  static everyFiveMinutes(): string {
    return '*/5 * * * *';
  }

  static everyTenMinutes(): string {
    return '*/10 * * * *';
  }

  static everyFifteenMinutes(): string {
    return '*/15 * * * *';
  }

  static everyThirtyMinutes(): string {
    return '*/30 * * * *';
  }

  static hourly(): string {
    return '0 * * * *';
  }

  static hourlyAt(minutes: number): string {
    if (minutes < 0 || minutes > 59) {
      throw new Error(`Invalid minutes: ${minutes}. Expected value between 0 and 59.`);
    }
    return `${minutes} * * * *`;
  }

  static everyOddHour(minutes: number = 0): string {
    if (minutes < 0 || minutes > 59) {
      throw new Error(`Invalid minutes: ${minutes}. Expected value between 0 and 59.`);
    }
    return `${minutes} 1-23/2 * * *`;
  }

  static everyTwoHours(minutes: number = 0): string {
    if (minutes < 0 || minutes > 59) {
      throw new Error(`Invalid minutes: ${minutes}. Expected value between 0 and 59.`);
    }
    return `${minutes} */2 * * *`;
  }

  static everyThreeHours(minutes: number = 0): string {
    if (minutes < 0 || minutes > 59) {
      throw new Error(`Invalid minutes: ${minutes}. Expected value between 0 and 59.`);
    }
    return `${minutes} */3 * * *`;
  }

  static everyFourHours(minutes: number = 0): string {
    if (minutes < 0 || minutes > 59) {
      throw new Error(`Invalid minutes: ${minutes}. Expected value between 0 and 59.`);
    }
    return `${minutes} */4 * * *`;
  }

  static everySixHours(minutes: number = 0): string {
    if (minutes < 0 || minutes > 59) {
      throw new Error(`Invalid minutes: ${minutes}. Expected value between 0 and 59.`);
    }
    return `${minutes} */6 * * *`;
  }

  static daily(): string {
    return '0 0 * * *';
  }

  static dailyAt(time: string): string {
    this.validateTime(time);
    const [hour, minute] = time.split(':').map(Number);
    return `${minute} ${hour} * * *`;
  }

  static twiceDaily(time1: number, time2: number): string {
    if (time1 < 0 || time1 > 23 || time2 < 0 || time2 > 23) {
      throw new Error(`Invalid hour: ${time1} or ${time2}. Expected value between 0 and 23.`);
    }
    return `0 ${time1}:00,${time2}:00 * * *`;
  }

  static twiceDailyAt(time1: number, time2: number, minute: number): string {
    if (time1 < 0 || time1 > 23 || time2 < 0 || time2 > 23 || minute < 0 || minute > 59) {
      throw new Error(`Invalid time or minute value. Expected hours between 0 and 23, and minutes between 0 and 59.`);
    }
    return `0 ${minute} ${time1},${time2} * *`;
  }

  static weekly(): string {
    return '0 0 * * 0';
  }

  static weeklyOn(dayOfWeek: number, time: string): string {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error(`Invalid dayOfWeek: ${dayOfWeek}. Expected value between 0 (Sunday) and 6 (Saturday).`);
    }
    this.validateTime(time);
    const [hour, minute] = time.split(':').map(Number);
    return `0 ${minute} ${hour} * * ${dayOfWeek}`;
  }

  static monthly(): string {
    return '0 0 1 * *';
  }

  static monthlyOn(dayOfMonth: number, time: string): string {
    if (dayOfMonth < 1 || dayOfMonth > 31) {
      throw new Error(`Invalid dayOfMonth: ${dayOfMonth}. Expected value between 1 and 31.`);
    }
    this.validateTime(time);
    const [hour, minute] = time.split(':').map(Number);
    return `0 ${minute} ${hour} ${dayOfMonth} *`;
  }

  static twiceMonthly(day1: number, day2: number, time: string): string {
    if (day1 < 1 || day1 > 31 || day2 < 1 || day2 > 31) {
      throw new Error(`Invalid days: ${day1} or ${day2}. Expected values between 1 and 31.`);
    }
    this.validateTime(time);
    const [hour, minute] = time.split(':').map(Number);
    return `0 ${minute} ${hour} ${day1},${day2} *`;
  }

  static lastDayOfMonth(time: string): string {
    this.validateTime(time);
    const [hour, minute] = time.split(':').map(Number);
    return `0 ${minute} ${hour} 28-31 * *`;
  }

  static quarterly(): string {
    return '0 0 1 1,4,7,10 *';
  }

  static quarterlyOn(dayOfMonth: number, time: string): string {
    if (dayOfMonth < 1 || dayOfMonth > 31) {
      throw new Error(`Invalid dayOfMonth: ${dayOfMonth}. Expected value between 1 and 31.`);
    }
    this.validateTime(time);
    const [hour, minute] = time.split(':').map(Number);
    return `0 ${minute} ${hour} ${dayOfMonth} 1,4,7,10`;
  }

  static yearly(): string {
    return '0 0 1 1 *';
  }

  static yearlyOn(month: number, day: number, time: string): string {
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      throw new Error(`Invalid month: ${month} or day: ${day}. Month must be between 1 and 12, and day between 1 and 31.`);
    }
    this.validateTime(time);
    const [hour, minute] = time.split(':').map(Number);
    return `0 ${minute} ${hour} ${day} ${month}`;
  }
}

export default SchedulerHelper;
