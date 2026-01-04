import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Terminal, Globe, Shield } from "lucide-react"

export default function GuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">API Integration Guide</h1>
        <p className="text-muted-foreground">Connect your software to Lycen for license verification.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ✅ ADDED 'min-w-0' HERE to fix mobile overflow */}
        <div className="lg:col-span-2 space-y-8 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Endpoint Information
              </CardTitle>
              <CardDescription>All requests should be made to our verification endpoint.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg border font-mono text-sm break-all">
                <span className="text-emerald-500 font-bold">POST</span> /api/verify
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Request Body (JSON)</h4>
                {/* overflow-x-auto works now because parent has min-w-0 */}
                <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-lg text-xs overflow-x-auto border border-zinc-800">
                  {`{
  "secret_key": "YOUR_APP_SECRET",
  "license_key": "USER_LICENSE_KEY",
  "hwid": "UNIQUE_HARDWARE_ID" 
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Code Examples
              </CardTitle>
              <CardDescription>Ready-to-use snippets for multiple languages.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="python">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="csharp">C#</TabsTrigger>
                  <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                </TabsList>

                <TabsContent value="python" className="mt-4">
                  <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-lg text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                    {`import requests
import uuid

def verify_license(license_key):
    # Get a unique hardware ID
    hwid = str(uuid.getnode())
    
    url = "https://mrx-lycen.vercel.app/api/verify"
    payload = {
        "secret_key": "YOUR_APP_SECRET",
        "license_key": license_key,
        "hwid": hwid
    }
    
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get("success"):
            print("Access Granted!")
            return True
        else:
            print(f"Access Denied: {data.get('message')}")
            return False
    except Exception as e:
        print(f"Connection Error: {e}")
        return False`}
                  </pre>
                </TabsContent>

                <TabsContent value="csharp" className="mt-4">
                  <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-lg text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                    {`using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

public class LycenClient {
    private static readonly HttpClient client = new HttpClient();

    public async Task<bool> Verify(string licenseKey) {
        var payload = new {
            secret_key = "YOUR_APP_SECRET",
            license_key = licenseKey,
            hwid = "SYSTEM_HWID_HERE"
        };

        var content = new StringContent(
            JsonSerializer.Serialize(payload), 
            System.Text.Encoding.UTF8, 
            "application/json"
        );

        var response = await client.PostAsync("https://mrx-lycen.vercel.app/api/verify", content);
        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<LycenResponse>(json);

        return result.success;
    }
}

public class LycenResponse {
    public bool success { get; set; }
    public string message { get; set; }
}`}
                  </pre>
                </TabsContent>

                <TabsContent value="nodejs" className="mt-4">
                  <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-lg text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                    {`const verifyLicense = async (licenseKey) => {
  const response = await fetch('https://mrx-lycen.vercel.app/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret_key: 'YOUR_APP_SECRET',
      license_key: licenseKey,
      hwid: 'CLIENT_HWID'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('Verified!');
    return true;
  } else {
    console.error('Error:', data.message);
    return false;
  }
};`}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* ✅ ADDED 'min-w-0' HERE TOO just in case */}
        <div className="space-y-8 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <Shield className="h-4 w-4 text-emerald-500" />
                Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong>Obfuscation:</strong> Always obfuscate your code before distribution to prevent attackers from
                tampering with the verification logic.
              </p>
              <p>
                <strong>HWID Binding:</strong> We automatically bind licenses to the first HWID that connects. This
                prevents account sharing.
              </p>
              <p>
                <strong>Secret Key:</strong> Never include your application secret key in a public repository or
                client-side web app.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <Terminal className="h-4 w-4 text-primary" />
                Common Statuses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs border-b pb-2">
                <span className="font-mono font-bold">200 OK</span>
                <span className="text-emerald-500">Success</span>
              </div>
              <div className="flex justify-between text-xs border-b pb-2">
                <span className="font-mono font-bold">401 Unauthorized</span>
                <span className="text-destructive">Invalid Key</span>
              </div>
              <div className="flex justify-between text-xs border-b pb-2">
                <span className="font-mono font-bold">403 Forbidden</span>
                <span className="text-destructive">HWID Mismatch</span>
              </div>
              <div className="flex justify-between text-xs border-b pb-2">
                <span className="font-mono font-bold">400 Bad Request</span>
                <span className="text-amber-500">Missing Data</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}