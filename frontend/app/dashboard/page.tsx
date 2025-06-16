"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Timer,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Smile,
  Meh,
  Frown,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

interface Task {
  id: string
  title: string
  completed: boolean
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [todayMood, setTodayMood] = useState<string | null>(null)
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    // Load tasks
    const savedTasks = localStorage.getItem("smartBuddyTasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    // Load today's mood
    const savedMood = localStorage.getItem("smartBuddyTodayMood")
    if (savedMood) {
      const moodData = JSON.parse(savedMood)
      const today = new Date().toDateString()
      if (moodData.date === today) {
        setTodayMood(moodData.mood)
      }
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [user, router])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      setIsRunning(false)
      // Switch between work and break
      if (isBreak) {
        setPomodoroTime(25 * 60) // Default to 25 minutes
        setIsBreak(false)
      } else {
        setPomodoroTime(5 * 60) // Default to 5 minutes
        setIsBreak(true)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, pomodoroTime, isBreak])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const setMood = (mood: string) => {
    setTodayMood(mood)
    const moodData = {
      date: new Date().toDateString(),
      mood: mood,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("smartBuddyTodayMood", JSON.stringify(moodData))
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Desktop Buddies
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentTime.toLocaleTimeString()}</span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.username}! 👋</h2>
          <p className="text-gray-600">
            Ready to have a productive day? Your buddy is here to help!
          </p>
        </div>

        {/* Desktop Buddy */}
        <Card className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">🤖</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Your Buddy says:</h3>
                <p className="text-purple-700">
                  "Good morning! I noticed you haven't checked in with your mood today. How are you feeling? Remember,
                  every small step counts towards your goals! 💪"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Mood</p>
                  <p className="text-2xl font-bold">
                    {todayMood ? (todayMood === "happy" ? "😊" : todayMood === "neutral" ? "😐" : "😔") : "❓"}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasks Done</p>
                  <p className="text-2xl font-bold">
                    {completedTasks}/{totalTasks}
                  </p>
                </div>
                <CheckSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Focus Time</p>
                  <p className="text-2xl font-bold">{formatTime(pomodoroTime)}</p>
                </div>
                <Timer className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Streak</p>
                  <p className="text-2xl font-bold">7 days</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Check-in */}
            {!todayMood && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Daily Mood Check-in</span>
                  </CardTitle>
                  <CardDescription>How are you feeling today? This helps track your mental wellness.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setMood("happy")}
                      className="flex-1 h-16 flex-col space-y-2"
                    >
                      <Smile className="h-6 w-6" />
                      <span>Great</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setMood("neutral")}
                      className="flex-1 h-16 flex-col space-y-2"
                    >
                      <Meh className="h-6 w-6" />
                      <span>Okay</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setMood("sad")}
                      className="flex-1 h-16 flex-col space-y-2"
                    >
                      <Frown className="h-6 w-6" />
                      <span>Tough</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pomodoro Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-blue-500" />
                  <span>Focus Timer</span>
                  <Badge variant={isBreak ? "secondary" : "default"}>{isBreak ? "Break Time" : "Focus Time"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="text-6xl font-mono font-bold text-blue-600">{formatTime(pomodoroTime)}</div>
                  <Progress
                    value={
                      isBreak
                        ? ((5 * 60 - pomodoroTime) / (5 * 60)) * 100
                        : ((25 * 60 - pomodoroTime) / (25 * 60)) * 100
                    }
                    className="w-full h-2"
                  />
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsRunning(false)
                        setPomodoroTime(isBreak ? 5 * 60 : 25 * 60)
                      }}
                      variant="outline"
                      size="lg"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                    <Link href="/mood">
                      <Heart className="h-6 w-6" />
                      <span className="text-xs">Mood Tracker</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                    <Link href="/tasks">
                      <CheckSquare className="h-6 w-6" />
                      <span className="text-xs">Tasks</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                    <Link href="/analytics">
                      <BarChart3 className="h-6 w-6" />
                      <span className="text-xs">Analytics</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                    <Link href="/mindfulness">
                      <span className="text-xl">🧘</span>
                      <span className="text-xs">Mindfulness</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <CheckSquare className="h-5 w-5 text-green-500" />
                    <span>Today's Tasks</span>
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/tasks">
                      <Plus className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          const updatedTasks = tasks.map((t) =>
                            t.id === task.id ? { ...t, completed: !t.completed } : t,
                          )
                          setTasks(updatedTasks)
                          localStorage.setItem("smartBuddyTasks", JSON.stringify(updatedTasks))
                        }}
                        className="rounded"
                      />
                      <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No tasks yet. Add some to get started!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Motivational Quote */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-800">
                  <span className="text-xl">✨</span>
                  <span>Daily Motivation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-orange-700 italic">
                  "The future depends on what you do today. Every small step forward is progress worth celebrating!"
                </blockquote>
                <p className="text-sm text-orange-600 mt-2">- Your Smart Buddy</p>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <span>Upcoming</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Math Study Session</p>
                      <p className="text-xs text-gray-500">Today, 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Project Deadline</p>
                      <p className="text-xs text-gray-500">Tomorrow, 11:59 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Team Meeting</p>
                      <p className="text-xs text-gray-500">Friday, 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
