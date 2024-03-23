import { ResponsiveBar } from "@nivo/bar";
import theme from "../Constants/BarTheme";

type graph_data = {
    stock: string;
    positive: number;
    positiveColor: string;
    negative: number;
    negativeColor: string;
    mixed: number;
    mixedColor: string;
  };

interface MyResponsiveBarProps {
    data: graph_data[];
  }

const MyResponsiveBar: React.FC<MyResponsiveBarProps> = ({ data }) => (
    <ResponsiveBar
      data={data}
      keys={["positive", "negative", "mixed"]}
      indexBy="stock"
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#22ff00", "#ff0000", "#ffcc00"]}
      colorBy="id"
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisLeft={null}
      layout="vertical"
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        truncateTickAt: 5,
        format: (value) => `${value}`, // format x-axis tick labels
      }}
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

  export default MyResponsiveBar;