function groupDataBySegments(data: any[], days: number) {
    const segments: { [key: string]: any[] } = {};

    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();

    const segmentDuration = 24 * 60 * 60 * 1000;

    data.forEach(([sentiment, timestamp]) => {
      const timestampNum = parseInt(timestamp);

      const daysAgo = Math.floor(
        (currentTimestamp - timestampNum) / (segmentDuration * days)
      );
      const segmentStart = currentTimestamp - daysAgo * segmentDuration * days;
      const segmentKey = new Date(segmentStart).toISOString().slice(0, 10);

      if (!segments[segmentKey]) {
        segments[segmentKey] = [0, 0, 0];
      }

      if (sentiment == "positive") {
        segments[segmentKey][0] = segments[segmentKey][0] + 1;
      } else if (sentiment == "negative") {
        segments[segmentKey][1] = segments[segmentKey][1] + 1;
      } else {
        segments[segmentKey][2] = segments[segmentKey][2] + 1;
      }

      // Add data point to the segment
      //segments[segmentKey].push([sentiment, timestamp]);
    });
    return segments;
  }

export default groupDataBySegments;