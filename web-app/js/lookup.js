(function(){

    var streets = Object.keys(addresses).sort();

    var inputStreet = document.getElementsByName("street-address")[0];
    var inputNumber = document.getElementsByName("house-number")[0];
    var datalistStreets = document.getElementById("street-addresses");
    var datalistNumbers = document.getElementById("house-numbers");
    var output = document.getElementById("output");
    var outputDivision = document.getElementById("division");
    var voterTemplate = document.getElementById("tmpl-voter");
    var outputVoters = document.getElementById("voters");


    function addStreets(){
        streets.forEach(function(street){
            var nodeOption = new Option(street, street);
            datalistStreets.appendChild(nodeOption);
        });
    }

    function addHouseNumbers(){
        if (!inputStreet.value) return;

        inputNumber.classList.add("number-ready");
        var houseNumbers = Object.keys(addresses[inputStreet.value]);
        houseNumbers.forEach(function(houseNumber){
            var nodeOption = new Option(houseNumber, houseNumber);
            datalistNumbers.appendChild(nodeOption);
        });
    }

    function clearVoters(){
        while (outputVoters.hasChildNodes()) {
            outputVoters.removeChild(outputVoters.firstChild);
        }
    }

    function lookup(){
        switch (this.getAttribute("name")) {
            case "street-address":
                // reset screen if street is empty
                if (!this.value){
                    output.classList.add("pre-number-entered");

                    inputNumber.classList.add("pre-number-entered");
                    inputNumber.classList.remove("number-ready");
                    inputNumber.value = null;
                    while (datalistNumbers.hasChildNodes()) {
                        datalistNumbers.removeChild(datalistNumbers.firstChild);
                    }

                    clearVoters();
                    inputStreet.classList.remove("post-street-entered");
                    return;
                }

                this.value = this.value.toUpperCase();
                var enteredStreet = addresses[this.value];
                if (enteredStreet){
                    this.classList.add("post-street-entered");
                    inputNumber.classList.add("number-ready");
                }
                break;
            case "house-number":
                clearVoters();
                outputDivision.innerText = "";
                var enteredNumber = this.value;
                var household = addresses[inputStreet.value][enteredNumber];
                if (household){
                    inputNumber.blur();
                    output.classList.remove("pre-number-entered");
                    outputDivision.innerText = household.district + ordinal_suffix(household.district) + " Division";

                    household.voters.forEach(function(voter){
                        voter.party = (voter.party === "D" || voter.party === "R"? voter.party : "Q");

                        voterTemplate.content.querySelectorAll("img")[0].src = "images\\" + voter.party + ".png";
                        voterTemplate.content.querySelectorAll("span")[0].innerText =
                            voter.firstName + " " + voter.middleName + " " + voter.lastName + " " + voter.suffix;

                        var clone = document.importNode(voterTemplate.content, true);
                        outputVoters.appendChild(clone);
                    });
                } else {
                    // outputDivision.innerText = "";
                }
                break;
            default:
                break;
        }
    }

    function ordinal_suffix(number) {
        var j = number % 10,
            k = number % 100;
        if (j == 1 && k != 11) {
            return "st";
        }
        if (j == 2 && k != 12) {
            return "nd";
        }
        if (j == 3 && k != 13) {
            return "rd";
        }
        return "th";
    }

    // initialize
    addStreets();
    inputStreet.addEventListener('input', lookup);
    inputStreet.addEventListener("transitionend", addHouseNumbers);

    inputNumber.addEventListener('input', lookup);

}());
