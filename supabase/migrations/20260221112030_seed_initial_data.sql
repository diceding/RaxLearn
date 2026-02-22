/*
  # Seed Initial Data for RaxLearn Platform

  1. Data Inserts
    - Career paths (Web Developer, Data Analyst, Mobile Developer)
    - Programming concepts (variables, loops, functions, etc.)
    - Concept prerequisites relationships
    - Sample projects with milestones
    - Hints for each milestone

  2. Notes
    - Provides initial learning paths for users
    - Establishes knowledge graph structure
    - Creates starter projects for each career path
*/

-- Insert Career Paths
INSERT INTO career_paths (name, description, icon, learning_objectives) VALUES
  ('Web Developer', 'Build modern web applications using HTML, CSS, JavaScript, and popular frameworks', 'globe', ARRAY['Master HTML/CSS fundamentals', 'Learn JavaScript and DOM manipulation', 'Build responsive layouts', 'Work with APIs and async programming', 'Use modern frameworks like React']),
  ('Data Analyst', 'Analyze data, create visualizations, and derive insights using Python and data tools', 'bar-chart', ARRAY['Learn Python programming basics', 'Master data manipulation with Pandas', 'Create visualizations with Matplotlib', 'Perform statistical analysis', 'Build interactive dashboards']),
  ('Mobile Developer', 'Create native and cross-platform mobile applications for iOS and Android', 'smartphone', ARRAY['Learn mobile UI/UX principles', 'Master React Native or Flutter', 'Implement navigation and state management', 'Work with device APIs', 'Publish to app stores'])
ON CONFLICT (name) DO NOTHING;

-- Insert Programming Concepts
INSERT INTO programming_concepts (name, description, difficulty, category, documentation_url) VALUES
  ('Variables & Data Types', 'Understanding how to store and manipulate different types of data', 'beginner', 'Fundamentals', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types'),
  ('Conditional Statements', 'Making decisions in code using if/else and switch statements', 'beginner', 'Control Flow', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling'),
  ('Loops & Iteration', 'Repeating actions using for, while, and array methods', 'beginner', 'Control Flow', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration'),
  ('Functions', 'Creating reusable blocks of code with parameters and return values', 'beginner', 'Fundamentals', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions'),
  ('Arrays', 'Working with ordered collections of data', 'beginner', 'Data Structures', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array'),
  ('Objects', 'Creating and manipulating key-value data structures', 'intermediate', 'Data Structures', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects'),
  ('DOM Manipulation', 'Selecting and modifying HTML elements with JavaScript', 'intermediate', 'Web Development', 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model'),
  ('Event Handling', 'Responding to user interactions like clicks and keyboard input', 'intermediate', 'Web Development', 'https://developer.mozilla.org/en-US/docs/Web/Events'),
  ('Async Programming', 'Working with promises, async/await, and handling asynchronous operations', 'intermediate', 'Advanced Concepts', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous'),
  ('API Integration', 'Fetching data from external APIs using fetch and handling responses', 'intermediate', 'Web Development', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API'),
  ('Local Storage', 'Persisting data in the browser for offline capability', 'intermediate', 'Web Development', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'),
  ('Error Handling', 'Managing errors gracefully with try/catch blocks', 'intermediate', 'Best Practices', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling')
ON CONFLICT (name) DO NOTHING;

-- Insert Concept Prerequisites (Knowledge Graph)
INSERT INTO concept_prerequisites (concept_id, prerequisite_id)
SELECT 
  (SELECT id FROM programming_concepts WHERE name = 'Conditional Statements'),
  (SELECT id FROM programming_concepts WHERE name = 'Variables & Data Types')
WHERE NOT EXISTS (
  SELECT 1 FROM concept_prerequisites 
  WHERE concept_id = (SELECT id FROM programming_concepts WHERE name = 'Conditional Statements')
  AND prerequisite_id = (SELECT id FROM programming_concepts WHERE name = 'Variables & Data Types')
);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id)
SELECT 
  (SELECT id FROM programming_concepts WHERE name = 'Loops & Iteration'),
  (SELECT id FROM programming_concepts WHERE name = 'Conditional Statements')
WHERE NOT EXISTS (
  SELECT 1 FROM concept_prerequisites 
  WHERE concept_id = (SELECT id FROM programming_concepts WHERE name = 'Loops & Iteration')
  AND prerequisite_id = (SELECT id FROM programming_concepts WHERE name = 'Conditional Statements')
);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id)
SELECT 
  (SELECT id FROM programming_concepts WHERE name = 'Arrays'),
  (SELECT id FROM programming_concepts WHERE name = 'Loops & Iteration')
WHERE NOT EXISTS (
  SELECT 1 FROM concept_prerequisites 
  WHERE concept_id = (SELECT id FROM programming_concepts WHERE name = 'Arrays')
  AND prerequisite_id = (SELECT id FROM programming_concepts WHERE name = 'Loops & Iteration')
);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id)
SELECT 
  (SELECT id FROM programming_concepts WHERE name = 'Objects'),
  (SELECT id FROM programming_concepts WHERE name = 'Arrays')
WHERE NOT EXISTS (
  SELECT 1 FROM concept_prerequisites 
  WHERE concept_id = (SELECT id FROM programming_concepts WHERE name = 'Objects')
  AND prerequisite_id = (SELECT id FROM programming_concepts WHERE name = 'Arrays')
);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id)
SELECT 
  (SELECT id FROM programming_concepts WHERE name = 'DOM Manipulation'),
  (SELECT id FROM programming_concepts WHERE name = 'Functions')
WHERE NOT EXISTS (
  SELECT 1 FROM concept_prerequisites 
  WHERE concept_id = (SELECT id FROM programming_concepts WHERE name = 'DOM Manipulation')
  AND prerequisite_id = (SELECT id FROM programming_concepts WHERE name = 'Functions')
);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id)
SELECT 
  (SELECT id FROM programming_concepts WHERE name = 'Event Handling'),
  (SELECT id FROM programming_concepts WHERE name = 'DOM Manipulation')
WHERE NOT EXISTS (
  SELECT 1 FROM concept_prerequisites 
  WHERE concept_id = (SELECT id FROM programming_concepts WHERE name = 'Event Handling')
  AND prerequisite_id = (SELECT id FROM programming_concepts WHERE name = 'DOM Manipulation')
);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id)
SELECT 
  (SELECT id FROM programming_concepts WHERE name = 'API Integration'),
  (SELECT id FROM programming_concepts WHERE name = 'Async Programming')
WHERE NOT EXISTS (
  SELECT 1 FROM concept_prerequisites 
  WHERE concept_id = (SELECT id FROM programming_concepts WHERE name = 'API Integration')
  AND prerequisite_id = (SELECT id FROM programming_concepts WHERE name = 'Async Programming')
);

-- Insert Sample Projects
INSERT INTO projects (title, description, difficulty, estimated_duration_hours, career_path_id, primary_language, technologies, learning_outcomes, project_order, starter_code, solution_code)
SELECT 
  'Interactive Todo List',
  'Build a fully functional todo list application with add, delete, and mark complete features. Learn DOM manipulation, event handling, and local storage.',
  'beginner',
  4,
  (SELECT id FROM career_paths WHERE name = 'Web Developer'),
  'JavaScript',
  ARRAY['HTML', 'CSS', 'JavaScript', 'Local Storage'],
  ARRAY['Master DOM element selection and manipulation', 'Handle user events effectively', 'Persist data using localStorage', 'Create dynamic user interfaces'],
  1,
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .todo-item { display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; margin: 5px 0; }
        .completed { text-decoration: line-through; opacity: 0.6; }
        button { margin-left: 10px; }
    </style>
</head>
<body>
    <h1>My Todo List</h1>
    <input type="text" id="todoInput" placeholder="Add a new task...">
    <button onclick="addTodo()">Add</button>
    <div id="todoList"></div>
    <script>
        // Your code here
    </script>
</body>
</html>',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .todo-item { display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; margin: 5px 0; }
        .completed { text-decoration: line-through; opacity: 0.6; }
        button { margin-left: 10px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>My Todo List</h1>
    <input type="text" id="todoInput" placeholder="Add a new task...">
    <button onclick="addTodo()">Add</button>
    <div id="todoList"></div>
    <script>
        let todos = JSON.parse(localStorage.getItem("todos")) || [];
        
        function renderTodos() {
            const list = document.getElementById("todoList");
            list.innerHTML = "";
            todos.forEach((todo, index) => {
                const div = document.createElement("div");
                div.className = "todo-item" + (todo.completed ? " completed" : "");
                div.innerHTML = `
                    <input type="checkbox" ${todo.completed ? "checked" : ""} onchange="toggleTodo(${index})">
                    <span>${todo.text}</span>
                    <button onclick="deleteTodo(${index})">Delete</button>
                `;
                list.appendChild(div);
            });
        }
        
        function addTodo() {
            const input = document.getElementById("todoInput");
            if (input.value.trim()) {
                todos.push({ text: input.value, completed: false });
                localStorage.setItem("todos", JSON.stringify(todos));
                input.value = "";
                renderTodos();
            }
        }
        
        function toggleTodo(index) {
            todos[index].completed = !todos[index].completed;
            localStorage.setItem("todos", JSON.stringify(todos));
            renderTodos();
        }
        
        function deleteTodo(index) {
            todos.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(todos));
            renderTodos();
        }
        
        renderTodos();
    </script>
</body>
</html>'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Interactive Todo List');

INSERT INTO projects (title, description, difficulty, estimated_duration_hours, career_path_id, primary_language, technologies, learning_outcomes, project_order)
SELECT 
  'Weather Dashboard',
  'Create a weather dashboard that fetches real-time weather data from an API and displays it beautifully. Master API integration and async programming.',
  'intermediate',
  6,
  (SELECT id FROM career_paths WHERE name = 'Web Developer'),
  'JavaScript',
  ARRAY['HTML', 'CSS', 'JavaScript', 'Fetch API', 'OpenWeather API'],
  ARRAY['Make HTTP requests using fetch', 'Handle asynchronous operations with async/await', 'Parse and display JSON data', 'Handle errors gracefully', 'Create responsive layouts'],
  2
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Weather Dashboard');

-- Insert Project Milestones for Todo List
INSERT INTO project_milestones (project_id, title, description, milestone_order, instructions, test_criteria)
SELECT 
  (SELECT id FROM projects WHERE title = 'Interactive Todo List'),
  'Setup and Display Static Todos',
  'Create the basic HTML structure and display a list of hardcoded todos',
  1,
  'Create an array of todo objects with text and completed properties. Loop through the array and display each todo in the todoList div. Each todo should show the text and a checkbox.',
  '{"criteria": ["Array of todos created", "Todos rendered in DOM", "Each todo has text displayed", "Each todo has checkbox"]}'
WHERE NOT EXISTS (
  SELECT 1 FROM project_milestones 
  WHERE project_id = (SELECT id FROM projects WHERE title = 'Interactive Todo List')
  AND title = 'Setup and Display Static Todos'
);

INSERT INTO project_milestones (project_id, title, description, milestone_order, instructions, test_criteria)
SELECT 
  (SELECT id FROM projects WHERE title = 'Interactive Todo List'),
  'Add New Todo Functionality',
  'Implement the ability to add new todos from the input field',
  2,
  'Create an addTodo function that gets the input value, creates a new todo object, adds it to the array, and re-renders the list. Clear the input after adding.',
  '{"criteria": ["addTodo function created", "Input value captured", "New todo added to array", "List re-rendered", "Input cleared"]}'
WHERE NOT EXISTS (
  SELECT 1 FROM project_milestones 
  WHERE project_id = (SELECT id FROM projects WHERE title = 'Interactive Todo List')
  AND title = 'Add New Todo Functionality'
);

INSERT INTO project_milestones (project_id, title, description, milestone_order, instructions, test_criteria)
SELECT 
  (SELECT id FROM projects WHERE title = 'Interactive Todo List'),
  'Toggle Todo Completion',
  'Allow users to mark todos as complete/incomplete',
  3,
  'Create a toggleTodo function that takes an index, flips the completed status, and re-renders. Add the completed CSS class to completed todos.',
  '{"criteria": ["toggleTodo function created", "Checkbox onChange event connected", "Completed status toggles", "Visual style changes"]}'
WHERE NOT EXISTS (
  SELECT 1 FROM project_milestones 
  WHERE project_id = (SELECT id FROM projects WHERE title = 'Interactive Todo List')
  AND title = 'Toggle Todo Completion'
);

INSERT INTO project_milestones (project_id, title, description, milestone_order, instructions, test_criteria)
SELECT 
  (SELECT id FROM projects WHERE title = 'Interactive Todo List'),
  'Delete Todo Functionality',
  'Add the ability to remove todos from the list',
  4,
  'Create a deleteTodo function that takes an index, removes the todo from the array using splice, and re-renders the list.',
  '{"criteria": ["deleteTodo function created", "Todo removed from array", "List re-rendered", "Correct todo deleted"]}'
WHERE NOT EXISTS (
  SELECT 1 FROM project_milestones 
  WHERE project_id = (SELECT id FROM projects WHERE title = 'Interactive Todo List')
  AND title = 'Delete Todo Functionality'
);

INSERT INTO project_milestones (project_id, title, description, milestone_order, instructions, test_criteria)
SELECT 
  (SELECT id FROM projects WHERE title = 'Interactive Todo List'),
  'Persist Data with localStorage',
  'Save todos to localStorage so they persist across page refreshes',
  5,
  'Use localStorage.setItem to save the todos array as JSON after every change. Use localStorage.getItem on page load to retrieve saved todos.',
  '{"criteria": ["localStorage.setItem used", "localStorage.getItem used", "Todos persist across refreshes", "JSON parsing/stringifying works"]}'
WHERE NOT EXISTS (
  SELECT 1 FROM project_milestones 
  WHERE project_id = (SELECT id FROM projects WHERE title = 'Interactive Todo List')
  AND title = 'Persist Data with localStorage'
);

-- Link milestones to concepts
INSERT INTO milestone_concepts (milestone_id, concept_id)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos'),
  (SELECT id FROM programming_concepts WHERE name = 'Arrays')
WHERE NOT EXISTS (
  SELECT 1 FROM milestone_concepts 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos')
  AND concept_id = (SELECT id FROM programming_concepts WHERE name = 'Arrays')
);

INSERT INTO milestone_concepts (milestone_id, concept_id)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos'),
  (SELECT id FROM programming_concepts WHERE name = 'DOM Manipulation')
WHERE NOT EXISTS (
  SELECT 1 FROM milestone_concepts 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos')
  AND concept_id = (SELECT id FROM programming_concepts WHERE name = 'DOM Manipulation')
);

INSERT INTO milestone_concepts (milestone_id, concept_id)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Add New Todo Functionality'),
  (SELECT id FROM programming_concepts WHERE name = 'Functions')
WHERE NOT EXISTS (
  SELECT 1 FROM milestone_concepts 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Add New Todo Functionality')
  AND concept_id = (SELECT id FROM programming_concepts WHERE name = 'Functions')
);

INSERT INTO milestone_concepts (milestone_id, concept_id)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Toggle Todo Completion'),
  (SELECT id FROM programming_concepts WHERE name = 'Event Handling')
WHERE NOT EXISTS (
  SELECT 1 FROM milestone_concepts 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Toggle Todo Completion')
  AND concept_id = (SELECT id FROM programming_concepts WHERE name = 'Event Handling')
);

INSERT INTO milestone_concepts (milestone_id, concept_id)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Persist Data with localStorage'),
  (SELECT id FROM programming_concepts WHERE name = 'Local Storage')
WHERE NOT EXISTS (
  SELECT 1 FROM milestone_concepts 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Persist Data with localStorage')
  AND concept_id = (SELECT id FROM programming_concepts WHERE name = 'Local Storage')
);

-- Insert Hints for each milestone
INSERT INTO hints (milestone_id, hint_level, hint_text, hint_type)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos'),
  1,
  'Think about what data structure is best for storing a collection of items. Each todo needs to have text and a completion status.',
  'conceptual'
WHERE NOT EXISTS (
  SELECT 1 FROM hints 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos')
  AND hint_level = 1
);

INSERT INTO hints (milestone_id, hint_level, hint_text, hint_type)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos'),
  2,
  'Look at how you''re getting the todoList div. Are you using document.getElementById? Then you need to loop through your todos array and create DOM elements for each one.',
  'directional'
WHERE NOT EXISTS (
  SELECT 1 FROM hints 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos')
  AND hint_level = 2
);

INSERT INTO hints (milestone_id, hint_level, hint_text, hint_type)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos'),
  3,
  'Check out Array.forEach() and document.createElement() in the MDN documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach',
  'documentation'
WHERE NOT EXISTS (
  SELECT 1 FROM hints 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Setup and Display Static Todos')
  AND hint_level = 3
);

INSERT INTO hints (milestone_id, hint_level, hint_text, hint_type)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Add New Todo Functionality'),
  1,
  'You need to capture the user''s input, create a new object with that text, and add it to your array. Then refresh the display.',
  'conceptual'
WHERE NOT EXISTS (
  SELECT 1 FROM hints 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Add New Todo Functionality')
  AND hint_level = 1
);

INSERT INTO hints (milestone_id, hint_level, hint_text, hint_type)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Add New Todo Functionality'),
  2,
  'Check your addTodo function. Are you getting the input value with document.getElementById("todoInput").value? Are you pushing to the todos array? Are you calling renderTodos()?',
  'directional'
WHERE NOT EXISTS (
  SELECT 1 FROM hints 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Add New Todo Functionality')
  AND hint_level = 2
);

INSERT INTO hints (milestone_id, hint_level, hint_text, hint_type)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Persist Data with localStorage'),
  1,
  'The browser provides a way to store data that persists even after closing the tab. This data must be in string format.',
  'conceptual'
WHERE NOT EXISTS (
  SELECT 1 FROM hints 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Persist Data with localStorage')
  AND hint_level = 1
);

INSERT INTO hints (milestone_id, hint_level, hint_text, hint_type)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Persist Data with localStorage'),
  2,
  'You need to convert your array to a string with JSON.stringify() when saving, and parse it back with JSON.parse() when loading. Do this after every change to the todos array.',
  'directional'
WHERE NOT EXISTS (
  SELECT 1 FROM hints 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Persist Data with localStorage')
  AND hint_level = 2
);

INSERT INTO hints (milestone_id, hint_level, hint_text, hint_type)
SELECT 
  (SELECT id FROM project_milestones WHERE title = 'Persist Data with localStorage'),
  3,
  'Learn about localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
  'documentation'
WHERE NOT EXISTS (
  SELECT 1 FROM hints 
  WHERE milestone_id = (SELECT id FROM project_milestones WHERE title = 'Persist Data with localStorage')
  AND hint_level = 3
);