import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        Sign In
                    </CardTitle>

                    <CardDescription>
                        Login to your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <LoginForm />
                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-medium underline" > Register </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}