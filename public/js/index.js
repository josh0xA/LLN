/*
Author: Josh Schiavone

Purpose: Boredeom but I like statistics

Note: Yes I know this code is absolutely terrible, I'm a C++ guy, not a web developer.
        I apologize for the atrocious code, I will fix it in the future - if i'm up for it. 
*/

var chart; 
let probs = []
let graph_probs = []
let iteration_trials = [] 
let theoretical_line = []

function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

function simulate_lln() {
    if (chart) {
        probs = []
        graph_probs = []
        iteration_trials = []
        theoretical_line = []
        chart.destroy()
      }

    let trials = parseInt(document.getElementById("trials").value)
    let prob_numerator = parseFloat(document.getElementById("numerator").value)
    let prob_denominator = parseFloat(document.getElementById("denominator").value)
    let success_counter = 0
    let other_counter = 0

    if (trials > 100000) {
        alert("The Maximum Number of Trials allowed is 100,000")
        return
    }

    if (prob_numerator > prob_denominator) {
        alert("The Probability Numerator cannot be greater than the Probability Denominator")
        return
    }

    if (prob_numerator < 1) {
        alert("The Probability Numerator cannot be less than 1")
        return
    }

    if (prob_denominator < 1) {
        alert("The Probability Denominator cannot be less than 1")
        return
    }

    if (prob_numerator == prob_denominator) {
        alert("The Probability Numerator cannot be equal to the Probability Denominator")
        return
    }

    if (prob_numerator != 1) {
        alert("The Probability Numerator must be equal to 1. This is a limitation although it will be fixed in the future.")
        return
    }

    let iter = 1;
    // Note that we're pushing the sample mean (x-bar), not the actual random variable
    // Thus the graph shows the sample mean as it tends towards the theoretical probability 
    while (iter <= trials) {
        iteration_trials.push(iter)
        if (randomNumber(prob_numerator, prob_denominator) == prob_numerator) {
            success_counter += 1;
        } else {
            other_counter += 1;
        }
        var simulated_prob = (success_counter / (success_counter + other_counter) * 100);
        // We only want to push the simulated probability if it is not equal to the theoretical probability because its bound to happen in early iterations
        if (simulated_prob != (prob_numerator / prob_denominator * 100)) { 
            probs.push(simulated_prob)
        }
        graph_probs.push(simulated_prob)
        iter++;
    }            
    fill_theoretical_line()
    draw_graph()
    clearFields()

    var table = document.getElementById("stats1");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = trials;
    cell2.innerHTML = getClosest(probs, (prob_numerator / prob_denominator * 100)) + "%";
    cell3.innerHTML = (prob_numerator / prob_denominator * 100).toFixed(2) + "%";
    // make "Summary" bold 
    document.getElementById("summary").style.fontWeight = "bold";
    summary.innerHTML = "Summary: " + success_counter + "/" + trials + " successes/trials. x\u0304 =  " + 
        (success_counter / (success_counter + other_counter) * 100).toFixed(7) + "%"
}

// Function that gets closest value in probs array to theoretical probability 
function getClosest(arr, closestTo) {
    var closest = Math.max.apply(null, arr);
    for (var i = 0; i < arr.length; i++) {
        if (Math.abs(arr[i] - closestTo) < Math.abs(closest - closestTo)) { 
            closest = arr[i]; 
        }
    }
    return closest;
}

function fill_theoretical_line() {
    var prob_numerator = document.getElementById("numerator").value;
    var prob_denominator = document.getElementById("denominator").value;
    var theoretical_prob = (prob_numerator / prob_denominator * 100);

    for (var i = 0; i < iteration_trials.length; i++) {
        theoretical_line.push(theoretical_prob);
    }
}

function draw_graph() {
    var numerator = document.getElementById("numerator").value;
    var denominator = document.getElementById("denominator").value;
    var theoretical_prob = (numerator / denominator * 100).toFixed(2);

    chart = new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
        labels: iteration_trials,
        datasets: [{ 
            data: graph_probs,
            label: "Simulated Probability",
            // set border color to hot pink
            borderColor: "rgb(255, 105, 180)",
            fill: false,
            pointRadius: 1
        }, {
            data: theoretical_line,
            label: "Theoretical Probability " + theoretical_prob + "%",
            borderColor: "rgb(0, 191, 255)",
            fill: true,
            pointRadius: 1
        }]
    },
    options: {
        title: {
        display: true,
        text: 'Live Graph As Simulated Probabilities Tend Towards Theoretical Probability (x\u0304 \u2192 \u03BC)'
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Trials'
                },
                ticks: {
                    autoSkip: true, 
                    autoSkipPadding: 10, 
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Percentage'
                },
                ticks: {
                    beginAtZero: true,
                    steps: 10, 
                    stepValue: 5,
                    max: 100
                },
                display: true,
            }]
        },
        // Change size of line 
        elements: {
            line: {
                borderWidth: 1
            }
        },      
    }
    });
}

function clearFields() {
    document.getElementById("trials").value = "";
    document.getElementById("numerator").value = "";
    document.getElementById("denominator").value = "";
}

function toggleLightMode() {
    var element = document.body;
    if (element.classList.contains("light-mode")) {
        element.classList.toggle("dark-mode");
    } else {
        element.classList.toggle("light-mode");
    }
}

function clearTable() {
    // Alert user that they are about to clear the table
    var table = document.getElementById("stats1");
    var rowCount = table.rows.length;
    // Check if table is empty
    if (rowCount > 2) {
        if (confirm("Are you sure you want to clear the table? This cannot be undone.") == true) {
            for (var i = rowCount - 1; i > 0; i--) {
                table.deleteRow(i);
            }
        } 
    }      
}
