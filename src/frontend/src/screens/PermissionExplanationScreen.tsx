import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Smartphone, Bell, MessageSquare, Info } from 'lucide-react';

interface PermissionExplanationScreenProps {
  onAcknowledge: () => void;
}

export default function PermissionExplanationScreen({ onAcknowledge }: PermissionExplanationScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight">Voice UPI Alert</CardTitle>
          <CardDescription className="text-lg">
            Privacy-First Payment Notification System
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-5 w-5 text-primary" />
            <AlertDescription className="text-base ml-2">
              <strong>Important:</strong> This is a web prototype. Native Android SMS and notification access features are not available in this browser-based version.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">What This App Would Do on Android:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <MessageSquare className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-base">SMS Reading</p>
                  <p className="text-sm text-muted-foreground">Detect credit transactions from bank SMS messages</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Bell className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-base">Notification Access</p>
                  <p className="text-sm text-muted-foreground">Monitor UPI app notifications (GPay, PhonePe, Paytm, Amazon Pay)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Smartphone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-base">Voice Announcements</p>
                  <p className="text-sm text-muted-foreground">Speak payment details even when screen is off</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-xl font-semibold">Privacy & Security:</h3>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>All processing happens offline on your device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>No data is uploaded to any server</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Your financial information stays private</span>
              </li>
            </ul>
          </div>

          <Alert className="bg-accent/10 border-accent">
            <AlertDescription className="text-base">
              In this web demo, you can manually paste transaction messages to test the parsing and voice announcement features.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex justify-center pt-6">
          <Button 
            onClick={onAcknowledge} 
            size="lg" 
            className="text-lg px-8 py-6 font-semibold"
          >
            I Understand - Continue to App
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
