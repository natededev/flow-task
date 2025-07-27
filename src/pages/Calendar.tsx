import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  const daysInCalendar = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    daysInCalendar.push(date);
  }
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };
  
  const mockEvents = [
    { date: '2025-09-03', title: 'Team Meeting', type: 'meeting' },
    { date: '2025-11-14', title: 'Project Deadline', type: 'deadline' },
    { date: '2025-11-27', title: 'Review Session', type: 'review' },
  ];
  
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Calendar
          </h1>
          <p className="text-muted-foreground mt-2">Track your tasks and deadlines</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => toast('Feature coming soon!')}>
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysInCalendar.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isToday = date.toDateString() === today.toDateString();
                
                return (
                  <div
                    key={index}
                    className={`
                      p-2 min-h-[80px] border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors
                      ${isCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground'}
                      ${isToday ? 'bg-primary/10 border-primary' : ''}
                    `}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {event.type}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};