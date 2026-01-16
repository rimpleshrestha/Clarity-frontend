"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/signup/api";
import { loginSchema, type LoginType } from "@/utils/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const Login = () => {
  const form = useForm<LoginType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
  });
  const onSubmit = (data: LoginType) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        localStorage.setItem("access_token", res.data?.access_token as string);
        navigate("/dashboard");
      },
      onError: (error) => {
        console.error(error.message);
        toast.error(error.message);
      },
    });
  };
  const [togglePasswordVisibility, setTogglePasswordVisibility] =
    useState<boolean>(false);
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url(bg.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Card className="relative bg-white max-w-xl w-full border rounded-xl px-8 py-8 shadow-lg/5 dark:shadow-xl from-muted/50 dark:from-transparent to-card overflow-hidden">
        <div className="relative isolate flex flex-col items-center">
          <CardHeader className="flex flex-col items-center relative w-full">
            <img src="logo.png" className="size-10" />
            <CardTitle className="mt-4 text-3xl text-black dark:text-white font-medium tracking-wide">
              Welcome Back
            </CardTitle>
            <span className="text-sm mb-7 block text-muted-foreground">
              Ready to clear your mind?
            </span>
          </CardHeader>
          <CardContent className="w-full px-0">
            {" "}
            <Form {...form}>
              <form
                className="w-full space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="rimple@gmail.com"
                          className="w-full text-black dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Password</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          <Input
                            type={
                              togglePasswordVisibility ? "text" : "password"
                            }
                            placeholder="**********"
                            className="w-full text-black dark:text-white"
                            {...field}
                          />
                          {togglePasswordVisibility ? (
                            <EyeIcon
                              className="absolute top-1/2 -translate-y-1/2 text-muted-foreground right-2"
                              onClick={() => {
                                setTogglePasswordVisibility((prev) => !prev);
                              }}
                            />
                          ) : (
                            <EyeClosedIcon
                              className="absolute top-1/2 -translate-y-1/2 text-muted-foreground right-2"
                              onClick={() => {
                                setTogglePasswordVisibility((prev) => !prev);
                              }}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isPending} type="submit" className="w-full">
                  Continue{" "}
                  {isPending && <Loader2 className="animate-spin size-4" />}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex text-black dark:text-white flex-col items-center px-0 ">
            <div className="mt-5 space-y-5">
              <p className="text-[14px] text-center">
                Don&apos;t have an account?
                <Link to="/signup" className="ml-1 text-black dark:text-white">
                  Sign up
                </Link>
              </p>
            </div>
            <span className="text-sm text-center mt-7 text-muted-foreground">
              Your thoughts are safe here. We respect your privacy
            </span>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default Login;
