<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const count = ref(0)
const name = ref('')
const open = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
    <h1 class="text-4xl font-bold tracking-tight">shadcn-vue Demo</h1>

    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Counter</CardTitle>
        <CardDescription>Click the button to increment</CardDescription>
      </CardHeader>
      <CardContent class="flex items-center justify-center">
        <Button @click="count++">
          Count is {{ count }}
        </Button>
      </CardContent>
    </Card>

    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Input</CardTitle>
        <CardDescription>Type something below</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input id="name" v-model="name" placeholder="Enter your name" />
        </div>
      </CardContent>
      <CardFooter>
        <p v-if="name" class="text-sm text-muted-foreground">
          Hello, {{ name }}!
        </p>
      </CardFooter>
    </Card>

    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This is a shadcn-vue dialog component.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="open = false">Cancel</Button>
          <Button @click="open = false">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
