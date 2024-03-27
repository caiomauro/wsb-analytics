type pie_data = {
    stock: string
    label: string
    value: number
    color: string
}
/* eslint-disable no-restricted-globals */
self.onmessage = (e) => {
    const data = e.data.data;
    try {
      const result = visualizationPieChart(data);
      self.postMessage(result);
    } catch (error) {
      console.error("Error in visualization:", error);
    }
  }

//Data [ticker, mentions]
const visualizationPieChart = (data: any) => {
    const final_data: any[] = []

    for (let i = 0; i < data.length; i++) {
        const pie_object: pie_data[] = [
            {
                stock: data[i][0],
                label: data[i][0],
                value: data[i][1],
                color: "hsl(180, 70%, 50%)"
            },
        ];

        final_data.push(pie_object[0]);
    }

    return final_data;

}

export default visualizationPieChart;