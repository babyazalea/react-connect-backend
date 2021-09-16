import React, { useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  const [tasks, setTasks] = useState([]);

  // sendRequest func 안에는 setState method가 포함되어 있다.
  // 아래의 useEffect에서 sendRequest(fetchTasks)를 불러오면, sendRequest func 내부의
  // setState가 작동하고, 변경된 state는 App Component로 전달된다.
  // 이때 변경된 state를 감지한 App Component는 자동으로 re-evluate(re-rendering)되어
  // 다시 useEffect에서 사용된 sendRequest를 '새롭게' 불러오게 되고
  // 다시 sendRequest func 내부의 setState가 작동하고,
  // 변경된 state를 감지한 App Component가 re-rendering...
  // 무한 루프(infinite loop)에 빠지게 된다!
  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  useEffect(() => {
    const transformTasks = (taskObj) => {
      const loadedTasks = [];

      for (const taskKey in taskObj) {
        loadedTasks.push({ id: taskKey, text: taskObj[taskKey].text });
      }

      setTasks(loadedTasks);
    };

    fetchTasks(
      {
        url: "https://all-the-practice-default-rtdb.firebaseio.com/tasks.json",
      },
      transformTasks
    );
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
