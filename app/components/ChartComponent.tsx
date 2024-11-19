import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const ChartComponent = ({ data, type }) => {
    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <View style={styles.container}>
            {type === 'line' && <Line data={data} options={options} />}
            {type === 'bar' && <Bar data={data} options={options} />}
            {type === 'pie' && <Pie data={data} options={options} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
});

export default ChartComponent;
