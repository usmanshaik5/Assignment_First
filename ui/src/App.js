import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from './ZTP.jpg';
import Chatbot from './Chatbot'; 
const App = () => {
    const [ruleInput, setRuleInput] = useState('');
    const [secondRuleInput, setSecondRuleInput] = useState('');
    const [combinedRuleIndices, setCombinedRuleIndices] = useState([]); // Selected rule indices for combining
    const [astOutput, setAstOutput] = useState('');
    const [attributes, setAttributes] = useState({
        age: '',
        department: '',
        salary: '',
        experience: ''
    });
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [createdRules, setCreatedRules] = useState([]); // State for storing created rules
    const [isChatbotVisible, setChatbotVisible] = useState(false);// State to control Chatbot visibility
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [editRule, setEditRule] = useState(null); // State to hold the rule being edited


    const toggleChatbot = () => {
        setIsChatbotOpen(prevState => !prevState); // Toggle Chatbot visibility
    };


    const handleOpenChatbot = () => {
        setChatbotVisible(true);
      };
    
      const handleCloseChatbot = () => {
        setChatbotVisible(false);
      };
    // const buttonStyle = {
    //     backgroundColor: '#007bff',
    //     color: 'white',
    //     padding: '10px 20px',
    //     border: 'none',
    //     borderRadius: '5px',
    //     cursor: 'pointer',
    //     marginRight: '10px',
    //     marginBottom: '10px',
    //     fontSize: '14px'
    // };
    
    // Fetch created rules from the backend on component mount
    useEffect(() => {
        const fetchCreatedRules = async () => {
            try {
                const response = await axios.get('http://localhost:5000/rules');
                setCreatedRules(response.data);
            } catch (error) {
                console.error('Error fetching rules:', error);
                alert('An error occurred while fetching the rules.');
            }
        };
        fetchCreatedRules();
    }, []);
    const createNewRule = (newRule) => {
        setAstOutput(newRule); // Update the state with the new AST rule
    };
    const handleCreateFirstRule = async () => {
        await createRule(ruleInput, 'first');
    };

    const handleCreateSecondRule = async () => {
        await createRule(secondRuleInput, 'second');
    };

    // Function to create a rule and add it to the created rules list
    const createRule = async (ruleString, ruleType) => {
        try {
            console.log(`Sending ${ruleType} rule:`, ruleString);
            const response = await axios.post('http://localhost:5000/rules/create', { rule_string: ruleString });
            setAstOutput(response.data);
            setCreatedRules((prevRules) => [...prevRules, response.data]); // Update rule list
        } catch (error) {
            console.error(`Error creating ${ruleType} rule:`, error);
            alert(`Error occurred while creating the ${ruleType} rule.`);
        }
    };

    const handleSaveRule = async (rule) => {
        if (!rule) {
            alert('Please create a rule before saving.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/rules/save', { rule_string: rule });
            alert('Rule saved successfully!');
        } catch (error) {
            console.error('Error saving rule:', error);
            alert('An error occurred while saving the rule.');
        }
    };

    const handleCombineRules = async () => {
        if (combinedRuleIndices.length < 2) {
            alert('Please select at least two rules to combine.');
            return;
        }

        // Get the rule strings from the selected rule indices
        const selectedRuleStrings = combinedRuleIndices.map(index => createdRules[index].rule_string);

        try {
            const response = await axios.post('http://localhost:5000/rules/combine', {
                rules: selectedRuleStrings
            });
            if (response.data && response.data.combined_rule) {
                setAstOutput(response.data.combined_rule); // Update with combined rule

                // Save the combined rule to the database
                await saveCombinedRule(response.data.combined_rule);
            } else {
                alert('No combined rule returned. Please check the server response.');
            }
        } catch (error) {
            console.error('Error combining rules:', error);
            alert('Error occurred while combining rules.');
        }
    };

    // Function to save the combined rule to the database
    const saveCombinedRule = async (combinedRule) => {
        try {
            await axios.post('http://localhost:5000/rules/save', { rule_string: combinedRule });
            alert('Combined rule saved successfully!');
        } catch (error) {
            console.error('Error saving combined rule:', error);
            alert('An error occurred while saving the combined rule.');
        }
    };

    // const handleEvaluateRule = async () => {
    //     // Ensure there is a valid combined rule (AST output) to evaluate
    //     if (!astOutput || astOutput === '') {
    //         alert('Please create a rule before evaluating.');
    //         return;
    //     }
    
    //     // Ensure the necessary attributes for evaluation are filled
    //     if (!attributes.age || !attributes.department || !attributes.salary || !attributes.experience) {
    //         alert('Please fill in all attributes (age, department, salary, experience) before evaluating.');
    //         return;
    //     }
    
    //     try {
    //         // Send a POST request to evaluate the rule with the attributes and AST output
    //         const response = await axios.post('http://localhost:5000/rules/evaluate', {
    //             attributes: {
    //                 age: attributes.age,
    //                 department: attributes.department,
    //                 salary: attributes.salary,
    //                 experience: attributes.experience
    //             },
    //             rule: astOutput // Send the combined rule (AST) for evaluation
    //         });
    
    //         // Check if the backend returned a valid evaluation result
    //         if (response.data && response.data.result !== undefined) {
    //             setEvaluationResult(response.data.result); // Update state with the evaluation result
    //         } else {
    //             alert('No valid evaluation result returned from the server.');
    //         }
    //     } catch (error) {
    //         console.error('Error evaluating rule:', error);
    //         alert('An error occurred while evaluating the rule.');
    //     }
    // };
    // const handleEvaluateRule = async () => {
    //     // Ensure there is a valid AST output to evaluate
    //     if (!astOutput || astOutput === '') {
    //         alert('Please create a rule before evaluating.');
    //         return;
    //     }
    
    //     // Ensure the necessary attributes for evaluation are filled
    //     if (!attributes.age || !attributes.department || !attributes.salary || !attributes.experience) {
    //         alert('Please fill in all attributes (age, department, salary, experience) before evaluating.');
    //         return;
    //     }
    
    //     try {
    //         // Send a POST request to evaluate the rule with the attributes and AST output
    //         const response = await axios.post('http://localhost:5000/rules/evaluate', {
    //             attributes: {
    //                 age: attributes.age,
    //                 department: attributes.department,
    //                 salary: attributes.salary,
    //                 experience: attributes.experience
    //             },
    //             ast: astOutput // Ensure this matches what the server expects
    //         });
    
    //         // Check if the backend returned a valid evaluation result
    //         if (response.data && response.data.result !== undefined) {
    //             setEvaluationResult(response.data.result); // Update state with the evaluation result
    //         } else {
    //             alert('No valid evaluation result returned from the server.');
    //         }
    //     } catch (error) {
    //         console.error('Error evaluating rule:', error);
    //         alert('An error occurred while evaluating the rule.');
    //     }
    // };

    const handleEvaluateRule = async () => {
        // Ensure there is a valid AST output to evaluate
        if (!astOutput || astOutput === '') {
            alert('Please create a rule before evaluating.');
            return;
        }
    
        // Ensure the necessary attributes for evaluation are filled
        if (!attributes.age || !attributes.department || !attributes.salary || !attributes.experience) {
            alert('Please fill in all attributes (age, department, salary, experience) before evaluating.');
            return;
        }
    
        try {
            // Send a POST request to evaluate the rule with the attributes and latest AST output
            const response = await axios.post('http://localhost:5000/rules/evaluate', {
                attributes: {
                    age: attributes.age,
                    department: attributes.department,
                    salary: attributes.salary,
                    experience: attributes.experience
                },
                ast: astOutput // Ensure this is the latest created rule
            });
    
            // Check if the backend returned a valid evaluation result
            if (response.data && response.data.result !== undefined) {
                setEvaluationResult(response.data.result); // Update state with the evaluation result
            } else {
                alert('No valid evaluation result returned from the server.');
            }
        } catch (error) {
            console.error('Error evaluating rule:', error);
            alert('An error occurred while evaluating the rule.');
        }
    };
    
    
    

    const handleInputChange = (field, value) => {
        setAttributes((prevAttributes) => ({
            ...prevAttributes,
            [field]: value
        }));
    };

    // Toggle the selection of rules for combining
    const toggleRuleSelection = (index) => {
        setCombinedRuleIndices((prevSelected) => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter((i) => i !== index); // Unselect rule
            } else {
                return [...prevSelected, index]; // Select rule
            }
        });
    };
const handleEditRule = (rule) => {
        setEditRule(rule);
        setRuleInput(rule.rule_string); // Populate input with the rule being edited
    };
 const handleUpdateRule = async () => {
        if (!editRule) return;

        try {
            const response = await axios.put(`http://localhost:5000/rules/update/${editRule.id}`, { rule_string: ruleInput });
            setCreatedRules((prevRules) => 
                prevRules.map((r) => (r.id === editRule.id ? response.data : r))
            );
            setEditRule(null);
            setRuleInput(''); // Clear input after update
        } catch (error) {
            console.error('Error updating rule:', error);
            alert('An error occurred while updating the rule.');
        }
    };
    // const buttonStyle = {
    //     backgroundColor: '#4CAF50', // Green background
    //     color: 'white',              // White text color
    //     border: 'none',              // Remove border
    //     borderRadius: '5px',         // Rounded corners
    //     padding: '10px 15px',        // Padding for button
    //     marginTop: '10px',           // Space above buttons
    //     cursor: 'pointer',            // Pointer cursor on hover
    //     transition: 'background-color 0.3s', // Smooth transition
    //     fontWeight: 'bold',           // Bold font
    // };
  
    
    const containerStyle = {
        padding: '20px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        position: 'absolute',
        top: -10,
        left: 0,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
        filter: 'brightness(0.7)' // Dims the background image
    };
    


    const formElementStyle = {
        marginBottom: '10px',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for better contrast
        width: '300px', // Reduce width for better readability
        textAlign: 'center',
    };
    
    const buttonStyle = {
        marginTop: '10px',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
        width: '100%', // Full width buttons for a cleaner look
    };
    
    const combineButtonStyle = {
        ...buttonStyle,
        width: 'auto',         // Button width will adjust to its content
        marginTop: '10px',     // Add margin to create space between the button and the scrollable area
    };
    
    const inputStyle = {
        width: '90%', // Reduce width to fit nicely inside container
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        marginBottom: '10px',
    };
    
    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '30px', // Increased spacing between columns
        width: '80%', // Control the width of the form
        marginBottom: '20px', // Add space below the row
    };
    
    // Add a column style to handle vertical stacking of rules and horizontal placement of the "Combine" section
    const leftColumnStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px', // Spacing between rule 1 and rule 2
    };
    
    // const rightColumnStyle = {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'flex-end',  // Align content to the right
    //     gap: '20px',
    // };
    
    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left', // Align labels to the left for better UX
    };
    
    const combineRulesStyle = {
        ...formElementStyle,   // Keep the existing styles for the form element
        width: '600px',        // Keep the increased width
        height: '200px',       // Set a fixed height
        overflowY: 'auto',     // Enable vertical scroll when content exceeds height
        paddingRight: '15px',  // Add padding to avoid content hiding behind the scrollbar
        marginBottom: '10px',  // Add some space below the scrollable area
    };
    const rightColumnStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align content to the top
        gap: '10px',
        marginTop: '-30px', // Optional: Move the container upwards by 20px
    };
    
    const inputStyles = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const buttonStyles= {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
        transition: 'background-color 0.3s',
    };

    const rowStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ccc',
    };
    const containerStyles = {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Dim background color
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
        marginTop: '70px',
        width:'80%',
        color:'black'
    };
    return (
        <div style={containerStyle}>
         <div style={{ marginLeft: '1200px' , marginTop: '45px'}}>
                    <button style={buttonStyle} onClick={handleOpenChatbot}>
                        {isChatbotOpen ? 'Close Chatbot' : 'Open Chatbot'}
                    </button>
                    {isChatbotVisible && <Chatbot onClose={handleCloseChatbot} />}
                </div>
            <h1 style={{ textAlign: 'center', fontSize: '32px', marginTop: '-65px', marginBottom: '45px' ,color:'black'}}>Rule Engine</h1>
           
            {/* Row for Entering Rules and Combining Rules */}
            <div style={rowStyle}>
            
                {/* Left column for rule inputs */}
                <div style={leftColumnStyle}>
                    <div style={formElementStyle}>
                        <label style={labelStyle}>
                            Enter First Rule:
                            <textarea
                                style={inputStyle}
                                rows="4"
                                value={ruleInput}
                                onChange={(e) => setRuleInput(e.target.value)}
                            />
                        </label>
                        <button style={buttonStyle} onClick={handleCreateFirstRule}>Create First Rule</button>
                        <button style={buttonStyle} onClick={() => handleSaveRule(ruleInput)}>Save First Rule</button>
                    </div>

                    <div style={formElementStyle}>
                        <label style={labelStyle}>
                            Enter Second Rule:
                            <textarea
                                style={inputStyle}
                                rows="4"
                                value={secondRuleInput}
                                onChange={(e) => setSecondRuleInput(e.target.value)}
                            />
                        </label>
                        <button style={buttonStyle} onClick={handleCreateSecondRule}>Create Second Rule</button>
                        <button style={buttonStyle} onClick={() => handleSaveRule(secondRuleInput)}>Save Second Rule</button>
                    </div>
                </div>

                {/* Right column for combined rules and button */}
                <div style={rightColumnStyle}>
                    <h2 style={{ marginBottom: '20px', textAlign: 'left',color:'black' }}>Combine Rules</h2>
                    <div style={combineRulesStyle}>
                        {createdRules.map((rule, index) => (
                            <div key={index} style={{ marginBottom: '10px', textAlign: 'left' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={combinedRuleIndices.includes(index)}
                                        onChange={() => toggleRuleSelection(index)}
                                        style={{ marginRight: '8px' }}
                                    />
                                    {rule.rule_string}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Combine button to the right */}
                    <button style={combineButtonStyle} onClick={handleCombineRules}>Combine Selected Rules</button>

                    {/* AST Output positioned below the Combine button */}
                    <h2 style={{ marginTop: '20px', textAlign: 'center',color:'black' }}>AST Output</h2>
                    <pre style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '300px',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                    }}>
                        {astOutput && JSON.stringify(astOutput, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Container for Evaluate Rule and Chatbot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ textAlign: 'center',color:'black' }}>Evaluate Rule</h2>
                    <div style={formElementStyle}>
                        {['age', 'department', 'salary', 'experience'].map((attr, i) => (
                            <label key={i} style={labelStyle}>
                                {attr.charAt(0).toUpperCase() + attr.slice(1)}:
                                <input
                                    type={attr === 'age' || attr === 'salary' || attr === 'experience' ? 'number' : 'text'}
                                    value={attributes[attr]}
                                    onChange={(e) => handleInputChange(attr, e.target.value)}
                                    style={inputStyle}
                                />
                            </label>
                        ))}
                        <button style={buttonStyle} onClick={handleEvaluateRule}>Evaluate Rule</button>
                    </div>

                    {evaluationResult !== null && (
                        <h3 style={{ color: evaluationResult ? 'lightgreen' : 'red', textAlign: 'center',color:'black' }}>
                            Evaluation Result: {evaluationResult ? 'Eligible' : 'Not Eligible'}
                        </h3>
                    )}
                </div>

                {/* Chatbot button and container */}
             
            </div>


            <div style={containerStyles}>
           {/* New Modification Rule Section */}
           <div style={{ marginBottom: '20px' }}>
                {/* <h2>Modification Rule</h2>
                <input 
                    type="text" 
                    value={ruleInput} 
                    onChange={(e) => setRuleInput(e.target.value)} 
                    placeholder="Enter Modification Rule"
                    style={inputStyles}
                /> */}
                {/* <button style={buttonStyles} onClick={handleCreateFirstRule}>Create Rule</button> */}
            </div>

            {/* New Edit Rules Section */}
            <div>
                <h2>Edit Rules</h2>
                {createdRules.map((rule, index) => (
                    <div key={index} style={rowStyle}>
                        <span>{rule.rule_string}</span>
                        <button style={buttonStyles} onClick={() => handleEditRule(rule)}>Edit</button>
                    </div>
                ))}
                {editRule && (
                    <div>
                        <input 
                            type="text" 
                            value={ruleInput} 
                            onChange={(e) => setRuleInput(e.target.value)} 
                            style={inputStyles} 
                        />
                        <button style={buttonStyles} onClick={handleUpdateRule}>Update Rule</button>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
    
    
};

export default App;
