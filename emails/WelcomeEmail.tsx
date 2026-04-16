import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  firstName: string;
}

export default function WelcomeEmail({ firstName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to WingMentor, {firstName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://wingmentor.app'}/logo.png`}
            width="120"
            height="40"
            alt="WingMentor"
            style={logo}
          />
          <Heading style={heading}>Welcome to WingMentor, {firstName}!</Heading>
          <Text style={text}>
            Thank you for creating your account. Your pilot recognition journey begins now.
          </Text>
          <Text style={text}>
            You can now access your dashboard, explore programs, and connect with the aviation community.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href="https://wingmentor.app/dashboard">
              Get Started
            </Button>
          </Section>
          <Text style={footer}>
            Best regards,<br />
            Benjamin Bowler<br />
            PilotRecognition Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const heading = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#1a1a1a',
  padding: '0 48px',
  textAlign: 'center' as const,
  marginTop: '32px',
};

const text = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  padding: '0 48px',
  marginTop: '16px',
};

const buttonContainer = {
  padding: '27px 0 27px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const footer = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  padding: '0 48px',
  marginTop: '48px',
};
