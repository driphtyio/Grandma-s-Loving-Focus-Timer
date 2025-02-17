import React, { useState, useEffect, useRef } from 'react';
import { Bell, Coffee, Heart, PauseCircle, PlayCircle, RotateCcw, Plus, Star, Trash2, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const GrandmaPomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const [grandmaQuotes] = useState([
    "You're doing wonderful, sweetie! Keep going!",
    "Remember to sit up straight, dear!",
    "Grandma is so proud of your hard work!",
    "Don't forget to take breaks, my love!",
    "You remind me of your father/mother when they were studying!"
  ]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('alarm.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  const playAlarm = () => {
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.log('Audio playback error:', error));
    }
  };

  const priorityColors = {
    high: 'bg-red-100 border-red-300 text-red-700',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    low: 'bg-green-100 border-green-300 text-green-700'
  };

  const priorityEmoji = {
    high: '❗',
    medium: '⭐',
    low: '💝'
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    playAlarm();
    if (!isBreak) {
      if (activeTask) {
        const updatedTasks = tasks.filter(t => t.id !== activeTask.id);
        setTasks(updatedTasks);
        setCompletedTasks(prev => [...prev, activeTask]);
        setActiveTask(null);
      }
      setTimeLeft(5 * 60);
      setIsBreak(true);
    } else {
      setTimeLeft(25 * 60);
      setIsBreak(false);
    }
    setIsRunning(false);
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        priority,
        createdAt: new Date()
      };
      setTasks(prev => [...prev, task]);
      setNewTask('');
      setPriority('medium');
    }
  };

  const startTask = (task) => {
    setActiveTask(task);
    setTimeLeft(25 * 60);
    setIsBreak(false);
    setIsRunning(true);
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRandomQuote = () => {
    return grandmaQuotes[Math.floor(Math.random() * grandmaQuotes.length)];
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card className="border-pink-200 bg-pink-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-serif text-pink-800 flex items-center justify-between">
            <span>Grandma's Love Timer {isBreak ? '☕' : '📚'}</span>
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 rounded-full hover:bg-pink-100"
              title={isSoundEnabled ? "Sound On" : "Sound Off"}
            >
              {isSoundEnabled ? 
                <Volume2 className="w-6 h-6 text-pink-600" /> : 
                <VolumeX className="w-6 h-6 text-pink-400" />
              }
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-6xl font-bold text-pink-700 font-mono">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-full hover:bg-pink-100"
            >
              {isRunning ? 
                <PauseCircle className="w-12 h-12 text-pink-600" /> : 
                <PlayCircle className="w-12 h-12 text-pink-600" />
              }
            </button>
            <button
              onClick={() => {
                setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
                setIsRunning(false);
              }}
              className="p-2 rounded-full hover:bg-pink-100"
            >
              <RotateCcw className="w-12 h-12 text-pink-600" />
            </button>
          </div>

          {activeTask && !isBreak && (
            <Alert className="bg-pink-100 border-pink-300">
              <Heart className="w-4 h-4 text-pink-600" />
              <AlertTitle className="text-pink-800 font-serif">
                Currently working on:
              </AlertTitle>
              <AlertDescription className="text-pink-700">
                {activeTask.text} {priorityEmoji[activeTask.priority]}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What do you need to do, dearie?"
                className="flex-1 p-2 border border-pink-300 rounded-lg"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-2 border border-pink-300 rounded-lg bg-white"
              >
                <option value="high">Important!</option>
                <option value="medium">Soon, dear</option>
                <option value="low">When you can</option>
              </select>
              <button
                onClick={addTask}
                className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-serif text-pink-800 mb-2">
                Tasks to Do (Grandma's List)
              </h3>
              <div className="space-y-2">
                {tasks.sort((a, b) => {
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                }).map(task => (
                  <div
                    key={task.id}
                    className={`p-2 rounded-lg border ${priorityColors[task.priority]} flex justify-between items-center`}
                  >
                    <span>{task.text} {priorityEmoji[task.priority]}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startTask(task)}
                        className="p-1 hover:bg-white rounded"
                      >
                        <PlayCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 hover:bg-white rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-serif text-pink-800 mb-2">
                Completed Tasks (Grandma is so proud!)
              </h3>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 bg-green-100 border border-green-300 rounded-lg text-green-700 flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>{task.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Alert className="bg-pink-100 border-pink-300">
            <Heart className="w-4 h-4 text-pink-600" />
            <AlertTitle className="text-pink-800 font-serif">
              Grandma says:
            </AlertTitle>
            <AlertDescription className="text-pink-700 italic">
              {isBreak ? 
                "Time for a little break, sweetie! Would you like some cookies? 🍪" :
                getRandomQuote()
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrandmaPomodoro;