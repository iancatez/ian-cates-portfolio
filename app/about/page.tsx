import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Learn more about my background and experience
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Background</CardTitle>
            <CardDescription>My journey in development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Add your background information here. Describe your experience,
              education, and what drives you as a developer.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Technologies and tools I work with</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Add your skills and technologies here. You can organize them by
              category (Frontend, Backend, Tools, etc.).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Get in touch</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Add your contact information here - email, LinkedIn, GitHub, etc.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

