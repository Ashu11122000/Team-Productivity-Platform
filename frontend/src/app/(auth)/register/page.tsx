import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { RegisterForm } from '@/features/auth/components/register-form';

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        Create Account
                    </CardTitle>

                    <CardDescription>
                        Register a new account
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <RegisterForm />

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium underline" > Login </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}