import { ResponsiveBar } from "@nivo/bar";
import theme from "../Constants/BarTheme";

type timeline_data = {
    day: string;
    positive: number;
    positiveColor: string;
    negative: number;
    negativeColor: string;
    mixed: number;
    mixedColor: string;
  };

interface MyResponsiveTimelineBarProps {
    data: timeline_data[];
  }

const MyResponsiveTimelineBar: React.FC<MyResponsiveTimelineBarProps> = ({
    data,
  }) => (
    <ResponsiveBar
      data={data}
      keys={["positive", "negative", "mixed"]}
      indexBy="day"
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#b3c8ff", "#0046ff", "#6690ff"]}
      colorBy="id"
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{ tickValues: 9 }}
      layout="vertical"
      labelSkipWidth={12}
      labelSkipHeight={12}
      borderWidth={1}
      theme={theme}
      role="application"
      tooltip={(data) => {
        return (
          <div className="flex flex-row bg-white p-1 px-2 rounded-md text-black">
            <p>
              <span className="font-bold italic">{data.indexValue}</span>: +
              {data.formattedValue} {data.id}
            </p>
          </div>
        );
      }}
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );

export default MyResponsiveTimelineBar;