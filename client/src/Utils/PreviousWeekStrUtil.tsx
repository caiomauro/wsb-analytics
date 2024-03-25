const getPreviousWeekStartDate = (): string => {
    const currentDate = new Date();
    const previousWeekStartDate = new Date(currentDate);
    previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
    return previousWeekStartDate.toISOString().slice(0, 10);
  };

export default getPreviousWeekStartDate;