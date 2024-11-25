"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Field, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Yup from "yup";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];
  const { toast } = useToast();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("errors.emailInvalid"))
      .required(t("errors.emailRequired")),
    password: Yup.string()
      .min(8, t("errors.passwordLength"))
      .required(t("errors.passwordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("errors.passwordMatch"))
      .required(t("errors.passwordRequired")),
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            {t("registerTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const res = await fetch("/api/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                const result = await res.json();

                if (result.error) {
                  toast({
                    variant: "destructive",
                    title: result.error,
                  });
                } else {
                  toast({
                    title: "Registration successful",
                    description: "Please login with your credentials",
                  });
                  router.push("/login");
                }
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "An error occurred",
                });
              } finally {
                console.log(values);
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    className={
                      errors.email && touched.email ? "border-red-500" : ""
                    }
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    className={
                      errors.password && touched.password
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.password && touched.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t("confirmPassword")}
                  </Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orng hover:bg-orng/80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : t("register")}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  {t("haveAccount")}{" "}
                  <Link href={`/${currentLocale}/login`} className="text-primary hover:underline text-orng">
                    {t("signIn")}
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
