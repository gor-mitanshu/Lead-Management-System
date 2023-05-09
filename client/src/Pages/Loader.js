import { CircularProgress, Grid } from '@mui/material'
import React from 'react'

const Loader = () => {
    return (
        <>
            <Grid
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress color="secondary" />
            </Grid>
        </>
    )
}

export default Loader